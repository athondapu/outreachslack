/* eslint-disable global-require */

const { authorizationScreen } = require("./authorization-screen");

module.exports = {
  openTasksView: require("./open-tasks-view"),
  completedTasksView: require("./completed-tasks-view"),
  authorizationScreen,
};
