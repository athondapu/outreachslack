const {
  openTasksView,
  completedTasksView,
  authorizationScreen
} = require("../user-interface/app-home");
const { size } = require("lodash");
const {
  getOpenTaskFilter,
  getClosedTaskFilter,
  getDueAtFilter,
  OPEN_TASKS,
  COMPLETED_TASKS,
  getOwnerIdFilter,
  getTaskURL,
  Get,
} = require("./outreach_api");
const { join, concat } = require("lodash");

const getTasks = async (view) => {
  const { state } = view;
  console.log("State: ", state);
  const { values } = state;
  if (values && size(values) > 0) {
    const taskCreationActions = values["task-creation-actions"];
    const {
      "app-home-task-type": appHomeTaskType,
      "app-home-task-datepicker-action": appHomeTaskDatepickerAction,
    } = taskCreationActions;
    const { type: datePickerType, selected_date } =
      appHomeTaskDatepickerAction | {};

    const {
      type,
      selected_option: {
        text: { text: selectedText },
        value: selectedValue,
      },
    } = appHomeTaskType || {};
    const filters = [];
    if (selectedValue === OPEN_TASKS) {
      filters.push(getOpenTaskFilter());
    } else if (selectedValue === COMPLETED_TASKS) {
      filters.push(getClosedTaskFilter());
    }
    if (datePickerType) {
      filters.push(getDueAtFilter(selected_date));
    }

    // Load generic filters
    if (type) {
      filters.push(getOwnerIdFilter(1640));
    }
    if (filters.length > 0) {
      const queryString = join(filters, "&");
      const url = concat(getTaskURL(), "/?", queryString).join("");
      const { data } = await Get(url);
      const { data: taskData } = data;
      return { tasks: taskData, viewCmpt: selectedValue };
    }
  }
  return {};
};

const reloadAppHome = async (context, client, body, slackUserId) => {
  if (!context.hasAuthorized) {
    publishAuthScreen(client, slackUserId);
  }
  const { user, team, view } = body;
  const slackUserID = user.id;
  try {
    const { tasks, viewCmpt } = await getTasks(view);
    if (viewCmpt === COMPLETED_TASKS) {
      await client.views.publish({
        user_id: slackUserID,
        view: completedTasksView(tasks),
      });
      return;
    }

    await client.views.publish({
      user_id: slackUserID,
      view: openTasksView(size(tasks) > 0 ? tasks : []),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

const publishAuthScreen = async (client, slackUserId) => {
  await client.views.publish({
    user_id: slackUserId,
    view: authorizationScreen(
      `${process.env.HEROKU_URL}/oauthstart/${slackUserId}`
    ),
  });
};

module.exports = { reloadAppHome };
