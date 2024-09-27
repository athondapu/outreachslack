const express = require('express');
const session = require('express-session');
const { App, ExpressReceiver, LogLevel } = require('@slack/bolt');
const config = require('./config/config');
const { registerListeners } = require('./listners');
const { registerCustomRoutes } = require('./routes');
const { fetchOAuthToken } = require('./routes/oauth-callback');
const persistedClient = require('./store/bolt-web-client');
const { authWithOutreach } = require('./middlewares/outreach-auth');
const { startOAuthProcess } = require('./routes/oauth-start');
const { registerMiddlewares } = require('./middlewares');
const {
    getTaskId,
    getDecryptedAccessToken,
    getUserProfileByUserId,
    replaceMentionsWithUsernames
} = require('./utilities/utils');
const { MarkComplete } = require('./utilities/outreach_api');
const { size } = require('lodash');
const { errorModal } = require('./exceptions/generic-exception');
const { UpdateNotes } = require('./utilities/outreach_api/http');

let logLevel;
switch (process.env.LOG_LEVEL) {
    case 'debug':
        logLevel = LogLevel.DEBUG;
        break;
    case 'info':
        logLevel = LogLevel.INFO;
        break;
    case 'warn':
        logLevel = LogLevel.WARN;
        break;
    case 'error':
        logLevel = LogLevel.ERROR;
        break;
    default:
        logLevel = LogLevel.INFO;
}

// Create custom express app to be able to use express-session middleware
const app = express();
app.use(
    session({
        secret: config.hmacKey,
        resave: true,
        saveUninitialized: true
    })
);

// Use custom ExpressReceiver to be able to use express-session middleware
// const receiver = new ExpressReceiver({
//     signingSecret: process.env.SLACK_SIGNING_SECRET,
//     app
// });

app.get('/oauthcallback', async (req, res) => {
    console.log('in oauth callback: ');
    await fetchOAuthToken(req, res);
});

app.get('/oauthstart/:slackUserId', async (req, res) => {
    console.log('in oauth start: ');
    await startOAuthProcess(req, res);
});

// Initializes your app with your bot token and signing secret
const boltApp = new App({
    ...config.slack,
    logLevel
    // receiver,
});

// Defining ExpressReceiver custom routes
// receiver.router.use(express.json());
// registerCustomRoutes().forEach((route) => {
//     const method = route.method[0].toLowerCase();
//     receiver.router[method](route.path, route.handler);
// });

// Register Listeners
registerListeners(boltApp);
// Register Middlewares
registerMiddlewares(boltApp);

// Assign Slack WebClient
persistedClient.client = boltApp.client;

// Use global middleware to fetch Outreach Authentication details
boltApp.use(authWithOutreach);

// boltApp.use((req, res, next) => {
//     console.log('Received headers:', req.headers);
//     next();
// });

boltApp.command('/record', async (payload) => {
    // console.log('record command payload: ', payload);
    const { say, ack, client, body } = payload;
    await ack();
    let { channel_id, user_id } = body;
    const allMessages = [];
    let cursor;

    try {
        do {
            const result = await client.conversations.history({
                channel: channel_id,
                cursor: cursor,
                limit: 100 // Adjust the limit as needed
            });

            allMessages.push(...result.messages);
            cursor = result.response_metadata.next_cursor; // Pagination
        } while (cursor);

        // Filter messages by date range
        const userNameVsMsg = await Promise.all(
            allMessages.map(async (message) => {
                const { user, text } = message;
                const { real_name } = await getUserProfileByUserId(
                    user,
                    client
                );
                const replacedText = await replaceMentionsWithUsernames(
                    text,
                    client
                );
                // console.log("replaced text: ", replacedText);
                return { userName: real_name, msg: replacedText };
            })
        );
        const notes = userNameVsMsg.map(entry => `${entry.userName}: ${entry.msg}`).join('\n\n');
        console.log('notes: ', notes);

        // Encode the multiline value for use in a URL
        const encodedValue = encodeURIComponent(notes);

        const { errors, data } = await UpdateNotes(306484, user_id, encodedValue)
        console.log("errors: ", errors)
        console.log("data: ", data)

        // Sort messages in ascending order based on timestamp
        // return filteredMessages.sort((a, b) => a.ts - b.ts);
    } catch (error) {
        console.error(error);
        return [];
    }
});

// Listen for the slash command '/mycommand'
boltApp.command('/completetask', async (payload) => {
    // console.log('command payload: ', payload);
    const { say, ack, respond, body } = payload;
    // Acknowledge the command
    await ack();
    let { text: taskId, channel_id, user_id } = body;
    if (!taskId) {
        taskId = getTaskId(channel_id);
    }
    const { accessToken } = getDecryptedAccessToken(user_id);
    if (!accessToken) {
        await respond('You have to login before executing this command');
    }

    const { errors, data } = await MarkComplete(taskId, user_id);

    console.log('errors: ', errors);
    console.log('Data: ', data);
    if (errors && size(errors) > 0) {
        const errorBlocks = errors.map((error) => {
            const { detail } = error;
            return {
                type: 'rich_text_list',
                style: 'bullet',
                elements: [
                    {
                        type: 'rich_text_section',
                        elements: [
                            {
                                type: 'text',
                                text: detail
                            }
                        ]
                    }
                ]
            };
        });
        const json = {
            blocks: [
                {
                    type: 'rich_text',
                    elements: [
                        {
                            type: 'rich_text_section',
                            elements: [
                                {
                                    type: 'text',
                                    text: 'Please check the following errors'
                                }
                            ]
                        },
                        ...errorBlocks
                    ]
                }
            ]
        };
        // console.log(json);
        // const errorJson = errorModal(json);
        // Respond with the text that the user sent
        await respond(json);
    } else {
        const { attributes } = data;
        const { action } = attributes;
        const successMessage = `The task *${taskId}* successfully marked as completed`;
        // Respond with the text that the user sent
        await respond(successMessage);
    }
});

// Asynchronous function to start the app
(async () => {
    const port = process.env.PORT || 3000;
    try {
        // Start your app
        await boltApp.start(port);
        console.log(`⚡️ Bolt app is running on port ${port}!`);
    } catch (error) {
        console.error('Unable to start App', error);
        process.exit(1);
    }

    app.listen(9000, () => {
        console.log(`Example app listening on port ${9000}`);
    });
})();
