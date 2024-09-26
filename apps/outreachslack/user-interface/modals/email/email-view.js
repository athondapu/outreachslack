const { Modal, Blocks, Elements } = require("slack-block-builder");

module.exports = (prefilledTitle, currentUser) => {
  const textInput = (channelName) => {
    if (channelName) {
      return Elements.TextInput({
        placeholder: "Do this thing",
        actionId: "channelName",
        initialValue: channelName,
      });
    }
    return Elements.TextInput({
      placeholder: "Do this thing",
      actionId: "channelName",
    });
  };

  return Modal({
    title: "Create new channel",
    submit: "Create",
    callbackId: "new-channel-modal",
  })
    .blocks(
      Blocks.Input({ label: "New channel", blockId: "channelName" }).element(
        textInput(prefilledTitle)
      ),
      Blocks.Input({
        label: "Assign users",
        blockId: "channelAssignUsers",
      }).element(
        Elements.UserMultiSelect({
          actionId: "channelAssignUsers",
        })
      )
    )
    .buildToJSON();
};
