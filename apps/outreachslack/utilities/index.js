/* eslint-disable global-require */

const {
  addProfile,
  addUserId,
  getOutreachUserId,
  getProfile,
} = require("./utils");
const { reloadAppHome } = require("./reload-app-home");

module.exports = {
  reloadAppHome,
  completeTasks: require("./complete-tasks"),
  addProfile,
  addUserId,
  getOutreachUserId,
  getProfile,
};
