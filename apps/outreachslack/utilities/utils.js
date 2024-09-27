const CryptoJS = require('crypto-js');
const config = require('../config/config');

const slackIdVsOutreachUserId = {};
const slackIdVsProfile = {};
const slackIdVsAuthInfo = {};
const channelNameVsTask = {};
const channelIdVsTask = {};
const taskIdVsMailingInfo = {};

const popultaeTaskIdVsMailingInfo = (taskId, mailingInfo) => {
    taskIdVsMailingInfo[taskId] = mailingInfo;
};

const getMailingInfoByTaskId = (taskId) => {
    return taskIdVsMailingInfo[taskId];
};

const popultaeChannelNameVsTask = (channelName, channelId, taskInfo) => {
    channelIdVsTask[channelId] = taskInfo;
    channelNameVsTask[channelName] = taskInfo;
};

const getTaskId = (channelId) => {
    return channelIdVsTask[channelId];
};

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
    // console.log("authInfo access slackId: ", slackId);
    // console.log("authInfo access: ", authInfo);
    if (authInfo) {
        const decryptedToken = CryptoJS.AES.decrypt(
            authInfo.accessToken,
            config.slack.aesKey
        ).toString(CryptoJS.enc.Utf8);
        return { accessToken: decryptedToken, tokenType: authInfo.tokenType };
    }
    return { accessToken: null, tokenType: null };
};

// Function to get user profile by user ID
const getUserProfileByUserId = async (userId, client) => {
    try {
        const result = await client.users.info({
            user: userId
        });

        // Extract and return user profile information
        return result.user.profile;
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
};

// Function to fetch user info by user ID
const fetchUserNameById = async (userId, client) => {
    try {
        const result = await client.users.info({ user: userId });

        // Return only the username or real name
        return result.user.real_name; // You can also use `result.user.real_name` for the full name
    } catch (error) {
        console.error(`Failed to fetch user info for ${userId}:`, error);
        return `<@${userId}>`; // Fallback in case of an error
    }
};

// Function to replace user mentions in a message
const replaceMentionsWithUsernames = async (messageText, client) => {
    const mentionRegex = /<@(\w+)>/g; // Regex to find user mentions
    let match;
    const promises = [];

    // Find all user mentions in the message text
    while ((match = mentionRegex.exec(messageText)) !== null) {
        const userId = match[1];
        promises.push(fetchUserNameById(userId, client));
    }

    // Wait for all username fetches to complete
    const usernames = await Promise.all(promises);

    // Replace mentions with corresponding usernames
    let replacedText = messageText;
    let i = 0;
    replacedText = replacedText.replace(mentionRegex, () => {
        return `${usernames[i++]},`; // Replace with username
    });
    return replacedText;
};

module.exports = {
    addUserId,
    getOutreachUserId,
    addProfile,
    getProfile,
    addAuthInfo,
    getAuthInfo,
    getDecryptedAccessToken,
    popultaeChannelNameVsTask,
    getTaskId,
    popultaeTaskIdVsMailingInfo,
    getMailingInfoByTaskId,
    getUserProfileByUserId,
    replaceMentionsWithUsernames
};
