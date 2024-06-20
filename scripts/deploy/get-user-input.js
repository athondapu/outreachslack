const { prompt } = require('enquirer');
const { validateAppName, generateUniqueAppName } = require('./util');

const userInputPrompt = async () => {
    const basicInfo = await promptBasicInfo();
    return basicInfo;
};

const promptBasicInfo = async () => {
    return (response = await prompt([
        {
            type: 'input',
            name: 'heroku-app',
            message: 'Heroku App Name',
            initial: generateUniqueAppName,
            validate: validateAppName
        },
        {
            type: 'password',
            name: 'slack-bot-token',
            message: 'Slack Bot Token'
        },
        {
            type: 'password',
            name: 'slack-signing-secret',
            message: 'Slack Signing Secret'
        },
        {
            type: 'password',
            name: 'outreach-client-id',
            message: 'Outreach Client ID'
        },
        {
            type: 'password',
            name: 'outreach-client-secret',
            message: 'Outreach Client Secret'
        },
        {
            type: 'password',
            name: 'aes-key',
            message: 'AES Key'
        }
    ]));
};

module.exports = {
    userInputPrompt
};
