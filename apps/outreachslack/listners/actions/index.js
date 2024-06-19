const {
  appHomeNavCompletedCallback,
} = require("./block_app-home-nav-completed");
const {
  appHomeNavCreateATaskCallback,
} = require("./block_app-home-nav-create-a-task");
const { appHomeNavOpenCallback } = require("./block_app-home-nav-open");
const { buttonMarkAsDoneCallback } = require("./block_button-mark-as-done");
const { reopenTaskCallback } = require("./block_reopen-task");
const {
  openTaskCheckboxClickedCallback,
} = require("./block_open_task_list_home");
const {
  appHomeTaskTypeSelectionCallback,
} = require("./block-app-home-task-type-selection");
const {
  appHomeTaskMarkCompleteCallback,
} = require("./block-app-home-task-mark-complete");
const {
  appHomeTaskStartChannelModalCallback,
} = require("./channels/block-app-home-task-start-channel");
const { appHomeAuthorizeButtonCallback } = require("./app-home-authorize-btn");

module.exports.register = (app) => {
  app.action(
    { action_id: "app-home-nav-completed", type: "block_actions" },
    appHomeAuthorizeButtonCallback
  );
  app.action(
    { action_id: "authorize-with-outreach", type: "block_actions" },
    appHomeNavCompletedCallback
  );
  app.action("app-home-nav-create-a-task", appHomeNavCreateATaskCallback);
  app.action(
    { action_id: "app-home-nav-open", type: "block_actions" },
    appHomeNavOpenCallback
  );
  app.action(
    { action_id: /app-home-task-type/ },
    appHomeTaskTypeSelectionCallback
  );
  app.action(
    { action_id: "button-mark-as-done", type: "block_actions" },
    buttonMarkAsDoneCallback
  );
  app.action(
    { action_id: "reopen-task", type: "block_actions" },
    reopenTaskCallback
  );
  app.action(
    {
      action_id: "blockOpenTaskCheckboxClicked",
      type: "block_actions",
    },
    openTaskCheckboxClickedCallback
  );

  app.action(
    {
      action_id:
        /^(app-home-task-overflow-action|app-home-task-overflow-mark-complete)$/,
    },
    appHomeTaskMarkCompleteCallback
  );
  app.action(
    {
      action_id: /^(app-home-task-overflow-start-channel)$/,
    },
    appHomeTaskStartChannelModalCallback
  );
};
