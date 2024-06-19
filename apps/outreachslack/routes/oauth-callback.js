"use strict";
const url = require("url");
const fs = require("fs");
const path = require("path");
const { upsert } = require("../outreach/dml/slack-authentication");
const { authWithOutreach } = require("../middlewares/outreach-auth");

const fetchOAuthToken = async (req, res) => {
  console.log("Executing user to user OAuth callback");

  try {
    // Retrieve slackuserId from session
    const slackUserId = req.session.slackUserId;

    if (slackUserId) {
      // Parse Authorization Code
      let code = url.parse(req.url, true).query.code;

      // Request Access and Refresh tokens
      const authInfo = await _requestAccessAndRefreshTokens(code);

      // Upsert record in Salesforce
      console.log("Correctly authorized, Storying tokens in Salesforce");
      await upsert(authInfo.connection, slackUserId, authInfo.salesforceUserId);

      // Force execution of auth middleware so that user to user auth
      // flow is executed and we obtain the user context
      const context = await authWithOutreach({
        slackUserId: slackUserId,
      });

      console.log("context in fetchOAuthToken: ", context);

      // Show travel requests in app home
      // Need to refresh the AppHome Screen

      // Send success message
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        fs.readFileSync(
          path.resolve(__dirname, "../routes/oauth-success.html")
        ),
        "utf-8"
      );
    } else {
      res.writeHead(500);
      res.end(
        "Missing Slack User Id in session. Failed to connect to Salesforce",
        "utf-8"
      );
    }
  } catch (e) {
    console.error(e);
    res.writeHead(500);
    res.end("Failed to connect to Salesforce", "utf-8");
  }
};

const _requestAccessAndRefreshTokens = async (code) => {
  console.log("Code: ", code);

  // TODO Get accesstoken and refreshtoken with the code

  return {
    salesforceUserId: 1,
    connection: {
      accessToken: "123adnewkjncwkncw",
      refreshToken: "ckmrwlcmowrco1234",
    },
  };
};

const oauthCallback = {
  path: "/oauthcallback",
  method: ["GET"],
  handler: fetchOAuthToken,
};

module.exports = { oauthCallback };
