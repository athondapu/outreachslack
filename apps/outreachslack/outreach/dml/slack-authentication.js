"use strict";
const CryptoJS = require("crypto-js");
const config = require("../../config/config");

const upsert = async (connection, slackUserId, outreachUserId) => {
  try {
    const encryptedAccessToken = CryptoJS.AES.encrypt(
      connection.accessToken,
      config.slack.aesKey
    ).toString();
    const encryptedRefreshToken = CryptoJS.AES.encrypt(
      connection.refreshToken,
      config.slack.aesKey
    ).toString();

    // Update the SlackUserID table with the following data
    const data = {
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      slackUserId: slackUserId,
      userId: outreachUserId,
    };

    // Creating a dummy result object. Later please replace with the proper DB call data.
    const result = {
        success: true
    }

    if (!result.success) {
      throw JSON.stringify(result);
    }

    return data;
  } catch (e) {
    throw "Failed to upsert auth info in Outreach: " + e.message;
  }
};

module.exports = { upsert };
