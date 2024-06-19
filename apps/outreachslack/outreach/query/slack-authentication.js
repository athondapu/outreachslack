"use strict";
const CryptoJS = require("crypto-js");
const config = require("../../config/config");

const querySlackAuthentication = async (slackUserId) => {
  try {
    // TODO get the slack user id info from DB. For now populating with dummy values
    const records = [
      {
        accessToken: "123adnewkjncwkncw",
        refreshToken: "ckmrwlcmowrco1234",
      },
    ];

    const result = [...records];

    if (result.records.length > 0) {
      result.records[0].accessToken = CryptoJS.AES.decrypt(
        result.records[0].accessToken,
        config.slack.aesKey
      ).toString(CryptoJS.enc.Utf8);
      result.records[0].refreshToken = CryptoJS.AES.decrypt(
        result.records[0].refreshToken,
        config.slack.aesKey
      ).toString(CryptoJS.enc.Utf8);
    }
    return result;
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = { querySlackAuthentication };
