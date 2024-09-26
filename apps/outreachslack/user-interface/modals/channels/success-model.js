const { Modal, Blocks } = require("slack-block-builder");

module.exports = () =>
  Modal({
    title: "Success",
    callbackId: "mail-sent-successfully",
  })
    .blocks(
      Blocks.Section({
        text: "Email sent successfully and mailing id 171951",
      })
    )
    .buildToJSON();
