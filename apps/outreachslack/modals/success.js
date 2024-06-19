const { Modal, Blocks } = require("slack-block-builder");
const { join } = require("lodash");

const successModal = (messages) => {
  const notes = messages.map((msg) => {
    return `:white_check_mark: ${msg}`;
  });

  let note = join(notes, "\n");
  return Modal({ title: "Success" })
    .blocks(
      Blocks.Section({
        text: note,
      })
    )
    .buildToJSON();
};

module.exports = { successModal };
