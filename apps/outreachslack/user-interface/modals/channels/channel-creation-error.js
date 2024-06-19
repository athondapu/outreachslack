const { Modal, Blocks } = require("slack-block-builder");

module.exports = (channelName, { data }) =>
  Modal({
    title: "Something went wrong",
    callbackId: "channel-creation-error-modal",
  })
    .blocks(
      Blocks.Section({
        text: `We couldn't create ${channelName}. Sorry!\n${data.error}`,
      })
    )
    .buildToJSON();
