const { size } = require("lodash");
const { channelModals } = require("../../user-interface/modals");
const { popultaeChannelNameVsTask } = require("../../utilities/utils");

const emailModalCallback = async (payload) => {
  const { ack, view, body, client } = payload;
  console.log("Email modal: ", JSON.stringify(view));
};

module.exports = { emailModalCallback };
