const reloadAppHome = require("../../utilities/reload-app-home");

const appHomeTaskOverflowActionCallback = async (payload) => {
  const { body, ack, client } = payload;
  console.log("body in appHomeTaskOverflowActionCallback: ", body);
  // const {actions} = body;
  const {view, actions} = body;
  const { state } = view;
  console.log("State: ", state);
  const { values } = state;
  console.log("Values: ", values);
  console.log("action: ", actions[0]);
  console.log(actions[0]);
  try {
    await ack();
    await reloadAppHome(client, body, body.view.private_metadata);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

module.exports = {
  appHomeTaskOverflowActionCallback,
};
