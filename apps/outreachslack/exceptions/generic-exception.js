const { Modal, Blocks } = require("slack-block-builder");
const { join } = require("lodash");

const errorModal = (errors) => {
  const errorMessages = errors.map((error) => {
    const { detail } = error;
    return `:x: ${detail}`;
  });

  let error = join(errorMessages, "\n");
  return Modal({ title: "Error Modal" })
    .blocks(
      Blocks.Section({
        text: error,
      })
    )
    .buildToJSON();
};

module.exports = { errorModal };
