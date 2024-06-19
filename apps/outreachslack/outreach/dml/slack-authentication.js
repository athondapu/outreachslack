'use strict';
const CryptoJS = require('crypto-js');
const config = require('../../config/config');
const { addAuthInfo } = require('../../utilities/utils');

const upsert = async (connection, slackUserId, outreachUserId) => {
    console.log('connection: ', connection);
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
            tokenType: connection.tokenType,
            slackUserId: slackUserId,
            userId: outreachUserId // Need to populate this Outreach User ID
        };

        console.log("data: ", data);

        // Creating a dummy result object. Later please replace with the proper DB call data.
        // At present temparorly storing the authinfo in-memory
        addAuthInfo(slackUserId, data);
    } catch (e) {
        console.error(e);
        throw 'Failed to upsert auth info in Outreach: ' + e.message;
    }
};

module.exports = { upsert };
