const reloadAppHome = require('../../utilities/reload-app-home');

const appHomeNavOpenCallback = async ({ body, ack, client }) => {
  console.log("open task body: ", body);
  const { actions } = body;
  // const action = actions[0];
  console.log("actions: ", actions);
  // const {selected_option} = action;
  // console.log("selected_option: ", selected_option);
  try {
    await ack();
    await reloadAppHome(client, body.user.id, body.team.id, 'open');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

module.exports = {
  appHomeNavOpenCallback,
};
