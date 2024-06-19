const CryptoJS = require('crypto-js');
const config = require('../config/config');

const slackIdVsOutreachUserId = {};
const slackIdVsProfile = {};
const slackIdVsAuthInfo = {};

const addUserId = (slackId, outreachUserId) => {
    slackIdVsOutreachUserId[slackId] = outreachUserId;
};

const getOutreachUserId = (slackId) => {
    return slackIdVsOutreachUserId[slackId];
};

const addProfile = (slackId, profile) => {
    slackIdVsProfile[slackId] = profile;
};

const getProfile = (slackId) => {
    return slackIdVsProfile[slackId];
};

const addAuthInfo = (slackId, authInfo) => {
    slackIdVsAuthInfo[slackId] = authInfo;
};

const getAuthInfo = (slackId) => {
    return slackIdVsAuthInfo[slackId];
};

const getDecryptedAccessToken = (slackId) => {
    const authInfo = getAuthInfo(slackId);
    console.log("authInfo access: ", authInfo.accessToken);
    if (authInfo) {
        const decryptedToken = CryptoJS.AES.decrypt(
            authInfo.accessToken,
            config.slack.aesKey
        ).toString(CryptoJS.enc.Utf8);
        return { accessToken: decryptedToken, tokenType: authInfo.tokenType };
    }
    return { accessToken: authInfo.accessToken, tokenType: authInfo.tokenType };
};

module.exports = {
    addUserId,
    getOutreachUserId,
    addProfile,
    getProfile,
    addAuthInfo,
    getAuthInfo,
    getDecryptedAccessToken
};
