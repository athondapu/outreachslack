// import { AllMiddlewareArgs, App, SlackEventMiddlewareArgs, ExpressReceiver } from "@slack/bolt";
// import type { GenericMessageEvent } from "@slack/bolt/dist/types/events/message-events.d.ts";
// import "dotenv/config";
// import express from "express";
// import bodyParser from "body-parser";

// type MessageEventArgs = AllMiddlewareArgs & SlackEventMiddlewareArgs<"message">;

// // Create an Express application
// const expressApp = express();
// expressApp.use(express.json());

// // Use body-parser middleware to handle URL verification challenge
// expressApp.use(bodyParser.json());

// const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET!, processBeforeResponse: true });
// receiver.app.use(expressApp);

// // Define the /slack/events endpoint for URL verification
// receiver.router.post("/slack/events", (req, res) => {
//   if (req.body.type === "url_verification") {
//     res.status(200).send(req.body.challenge);
//   }
// });

// receiver.router.get("/ping", (req, res)=>{
//     res.send('pong');
// })

// // Initializes your app with your bot token and signing secret
// const app = new App({
//   token: process.env.SLACK_BOT_TOKEN,
//   signingSecret: process.env.SLACK_SIGNING_SECRET,
//   //   socketMode: true,
//   appToken: process.env.SLACK_APP_TOKEN,
//   receiver
// });

// // Listens to incoming messages that contain "hello"
// app.message("hello", async (args: MessageEventArgs) => {
//   // say() sends a message to the channel where the event was triggered
//   const { message: genericMessage, client, body, say } = args;
//   const message = genericMessage as GenericMessageEvent;
//   console.log("in message listner", message);
//   await say({
//     blocks: [
//       {
//         type: "section",
//         text: {
//           type: "mrkdwn",
//           text: `Hey there <@${message.user}>!`,
//         },
//         accessory: {
//           type: "button",
//           text: {
//             type: "plain_text",
//             text: "Click Me",
//           },
//           action_id: "button_click",
//         },
//       },
//     ],
//     text: `Hey there <@${message.user}>!`,
//   });
// });

// app.action("button_click", async ({ body, ack, say }) => {
//   console.log("body: ", body);
//   // Acknowledge the action
//   await ack();
//   await say(`<@${body.user.id}> clicked the button`);
// });

// (async () => {
//   // Start your app
//   console.log("process.env.PORT:", process.env.PORT);
//   await app.start(process.env.PORT || 3000);

//   console.log("⚡️ Bolt app is running!");
// })();
