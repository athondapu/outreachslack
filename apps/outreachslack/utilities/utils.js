const slackIdVsOutreachUserId = {};
const slackIdVsProfile = {};

const addUserId = (slackId, outreachUserId) => {
  slackIdVsOutreachUserId[slackId] = outreachUserId;
};

const getOutreachUserId = (slackId) => {
  return slackIdVsOutreachUserId[slackId];
};

const addProfile = (slackId, profile) => {
    slackIdVsProfile[slackId] = profile;
}

const getProfile = (slackId) => {
    return slackIdVsProfile[slackId];
}

module.exports = {
    addUserId,
    getOutreachUserId,
    addProfile,
    getProfile
}
