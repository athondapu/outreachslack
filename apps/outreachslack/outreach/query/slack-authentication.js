'use strict';
const CryptoJS = require('crypto-js');
const config = require('../../config/config');
const { getAuthInfo } = require('../../utilities/utils');

const querySlackAuthentication = async (slackUserId) => {
    try {
        // TODO get the slack user id info from DB. For now populating with dummy values
        const authInfo = getAuthInfo(slackUserId);
        console.log("authInfo: ", authInfo);
        const result = {};
        if (authInfo) {
            result.accessToken = CryptoJS.AES.decrypt(
                authInfo.accessToken,
                config.slack.aesKey
            ).toString(CryptoJS.enc.Utf8);
            result.refreshToken = CryptoJS.AES.decrypt(
                authInfo.refreshToken,
                config.slack.aesKey
            ).toString(CryptoJS.enc.Utf8);
            result.tokenType = authInfo.tokenType
        }
        console.log("result: ", result);
        return result;
    } catch (e) {
        throw new Error(e.message);
    }
};

module.exports = { querySlackAuthentication };
