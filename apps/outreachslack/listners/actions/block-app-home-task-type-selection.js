const reloadAppHome = require("../../utilities/reload-app-home");

const appHomeTaskTypeSelectionCallback = async (payload) => {
  const { body, ack, client } = payload;
  // console.log("body: ", body);
  try {
    await ack();
    await reloadAppHome(client, body, body.view.private_metadata);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

module.exports = {
  appHomeTaskTypeSelectionCallback,
};
