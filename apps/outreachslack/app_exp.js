// const {
//   App,
//   LogLevel,
//   // SocketModeReceiver,
//   ExpressReceiver,
// } = require("@slack/bolt");
// const { FileInstallationStore } = require("@slack/oauth");
// require("dotenv").config();
// const { registerListeners } = require("./listners");
// const { registerMiddlewares } = require("./middlewares");

// let logLevel;
// switch (process.env.LOG_LEVEL) {
//   case "debug":
//     logLevel = LogLevel.DEBUG;
//     break;
//   case "info":
//     logLevel = LogLevel.INFO;
//     break;
//   case "warn":
//     logLevel = LogLevel.WARN;
//     break;
//   case "error":
//     logLevel = LogLevel.ERROR;
//     break;
//   default:
//     logLevel = LogLevel.INFO;
// }

// // const SocketModeReceiver1 = new SocketModeReceiver({
// //   logLevel: logLevel,
// //   appToken: process.env.SLACK_APP_TOKEN,
// //   clientId: process.env.SLACK_CLIENT_ID,
// //   clientSecret: process.env.SLACK_CLIENT_SECRET,
// //   stateSecret: "my-state-secret",
// //   // redirectUri: "",
// //   scopes: [
// //     "channels:manage",
// //     "channels:history",
// //     "channels:read",
// //     "groups:read",
// //     "chat:write",
// //     "app_mentions:read",
// //     "channels:manage",
// //     "commands",
// //   ],
// //   installationStore: new FileInstallationStore(),
// //   installerOptions: {
// //     port: 4999,
// //     installPath: "/slack/install",
// //     redirectUriPath: "/slack/redirect",
// //     userScopes: ["chat:write"],
// //     callbackOptions: {
// //       success: (installation, installOptions, req, res) => {
// //         // Do custom success logic here
// //         res.send("successful!", installation);
// //         res.send("installOptions successful!", installOptions);
// //       },
// //       failure: (error, installOptions, req, res) => {
// //         // Do custom failure logic here
// //         console.error("error: ", error);
// //         res.send("failure", error);
// //         res.send("failure installOptions", installOptions);
// //       },
// //     },
// //   },
// // });

// // Define the ExpressReceiver and attach it to your app
// const expressReceiver = new ExpressReceiver({
//   signingSecret: process.env.SLACK_SIGNING_SECRET,
//   logLevel: logLevel,
//   // appToken: process.env.SLACK_APP_TOKEN,
//   clientId: process.env.SLACK_CLIENT_ID,
//   clientSecret: process.env.SLACK_CLIENT_SECRET,
//   stateSecret: "my-state-secret",
//   // endpoints: "/slack/events",
//   // endpoints: { events: '/slack/events' },
//   // redirectUri: "",
//   scopes: [
//     "channels:manage",
//     "channels:history",
//     "channels:read",
//     "groups:read",
//     "chat:write",
//     "app_mentions:read",
//     "channels:manage",
//     "commands",
//   ],
//   installationStore: new FileInstallationStore(),
//   // installerOptions: {
//   //   port: 4999,
//   //   installPath: "/slack/install",
//   //   redirectUriPath: "/slack/redirect",
//   //   userScopes: [
//   //     "channels:manage",
//   //     "channels:history",
//   //     "channels:read",
//   //     "groups:read",
//   //     "chat:write",
//   //     "app_mentions:read",
//   //     "channels:manage",
//   //     "commands",
//   //   ],
//   // },
// });

// // Initializes your app with your bot token and signing secret
// const app = new App({
//   // token: process.env.SLACK_BOT_TOKEN,
//   // signingSecret: process.env.SLACK_SIGNING_SECRET,
//   // socketMode: true,
//   // appToken: process.env.SLACK_APP_TOKEN,
//   // receiver: SocketModeReceiver1,
//   receiver: expressReceiver,
// });

// // app.receiver = expressReceiver;

// // expressReceiver.router.post("/slack/events", async (req, res) => {
// //   console.log("Getting in events callback: ");
// // });

// // // Handle OAuth callback from Slack
// // expressReceiver.router.get("/slack/redirect", async (req, res) => {
// //   const { code } = req.query;
// //   console.log("Code: ", code);
// //   try {
// //     // Process the code to exchange for tokens
// //     const result = await app.client.oauth.v2.access({
// //       client_id: process.env.SLACK_CLIENT_ID,
// //       client_secret: process.env.SLACK_CLIENT_SECRET,
// //       code,
// //     });
// //     console.log("result: ", result);
// //     // Handle the result, store tokens, and complete authentication
// //     res.send("Authentication successful!");
// //   } catch (error) {
// //     console.error("Error exchanging code for token:", error);
// //     res.status(500).send("Authentication failed");
// //   }
// // });

// // expressReceiver.router.get("/secret-page", (req, res) => {
// //   // You're working with an express req and res now.
// //   res.send("yay!");
// // });

// registerListeners(app);
// registerMiddlewares(app);

// (async () => {
//   // Start your app
//   await app.start();

//   console.log("⚡️ Bolt app is running!");
// })();

const { App, ExpressReceiver } = require("@slack/bolt");
const express = require("express");

// Create an ExpressReceiver with OAuth support
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: "my-state-secret", // Replace with your own state secret
  scopes: ["channels:read", "chat:write", "app_mentions:read"], // Replace with your app's required scopes
  installationStore: {
    storeInstallation: async (installation) => {
      console.log("installation: ", installation);
      // Change the line below so it saves to your database
      // e.g., await database.set(installation.team.id, installation);
    },
    fetchInstallation: async ({ teamId, enterpriseId }) => {
      console.log("Team ID: ", teamId);
      console.log("enterpriseId: ", enterpriseId);
      // Change the line below so it fetches from your database
      // e.g., return await database.get(installQuery.teamId);
    },
  },
});

// Initialize the Bolt app with the receiver
const app = new App({
  receiver,
  authorize: async ({ teamId, enterpriseId }) => {
    console.log("in authorize function");
    const installation =
      await receiver.installer.installationStore.fetchInstallation({
        teamId,
        enterpriseId,
      });
    console.log("in authorize function installation", installation);
    if (installation) {
      return {
        botToken: installation.bot.token,
        botId: installation.bot.id,
        botUserId: installation.bot.userId,
        team: installation.team,
        enterprise: installation.enterprise,
      };
    } else {
      throw new Error("No installation found for this team");
    }
  },
  authorize: async ({ teamId, enterpriseId }) => {
    // Fetch the installation from your database
    const installation = await installationStore.fetchInstallation({
      teamId,
      enterpriseId,
    });
    if (installation) {
      return {
        botToken: installation.bot.token,
        botId: installation.bot.id,
        botUserId: installation.bot.userId,
        team: installation.team,
        enterprise: installation.enterprise,
      };
    } else {
      throw new Error("No installation found for this team");
    }
  },
});

// Create a custom Express app
const customExpressApp = express();

// Custom middleware to handle the Slack challenge
customExpressApp.post("/slack/events", express.json(), (req, res) => {
  console.log("In slack events route:");
  if (req.body.type === "url_verification") {
    res.send({ challenge: req.body.challenge });
  } else {
    receiver.requestHandler(req, res);
  }
});

// Handle Slack events
app.event("app_mention", async ({ event, say }) => {
  await say(`Hello, <@${event.user}>!`);
});

// Use the receiver middleware
customExpressApp.use("/slack/events", receiver.router);

// Define additional routes if needed
customExpressApp.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Start the custom Express app
const port = 4999;
customExpressApp.listen(port, () => {
  console.log(`Custom Express app is running on port ${port}`);
});
