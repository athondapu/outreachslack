const { Modal, Blocks } = require("slack-block-builder");

module.exports = (channelName) =>
  Modal({
    title: "Channel created",
    callbackId: "channel-created-modal",
  })
    .blocks(
      Blocks.Section({
        text: `*${channelName}* created`,
      })
    )
    .buildToJSON();
