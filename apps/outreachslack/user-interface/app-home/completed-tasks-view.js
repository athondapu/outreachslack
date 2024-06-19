const {
  HomeTab,
  Header,
  Divider,
  Section,
  Actions,
  Elements,
  Bits
} = require("slack-block-builder");
const pluralize = require("pluralize");

const { OPEN_TASKS, COMPLETED_TASKS } = require("../../utilities/outreach_api");

const optionsData = [
  { text: OPEN_TASKS, value: OPEN_TASKS },
  { text: COMPLETED_TASKS, value: COMPLETED_TASKS },
];

module.exports = (recentlyCompletedTasks) => {
  console.log("in completed tasks view");
  const homeTab = HomeTab({
    callbackId: "tasks-home",
    privateMetaData: "completed",
  }).blocks(
    Actions({ blockId: "task-creation-actions" }).elements(
      Elements.StaticSelect({ placeholder: "Choose your favorite..." })
        .actionId("app-home-task-type")
        .options(
          optionsData.map((item) =>
            Bits.Option({ text: item.text, value: item.value })
          )
        ),
      Elements.DatePicker()
        .actionId("app-home-task-type-datepicker-action")
        .initialDate(new Date())
        .placeholder("Select a date")
    )
  );

  if (recentlyCompletedTasks.length === 0) {
    homeTab.blocks(
      Header({ text: "No completed tasks" }),
      Divider(),
      Section({ text: "Looks like you've got nothing completed." })
    );
    return homeTab.buildToJSON();
  }

  const completedTaskList = recentlyCompletedTasks.map((task) => {
    const { attributes, id } = task;
    const { note, title } = attributes;
    return Section({ text: `• ~${title ? title : note}~` }).accessory(
      Elements.Button({ text: "Reopen" }).value(`${id}`).actionId("reopen-task")
    );
  });

  homeTab.blocks(
    Header({
      text: `You have ${
        recentlyCompletedTasks.length
      } completed ${pluralize("task", recentlyCompletedTasks.length)}`,
    }),
    Divider(),
    completedTaskList
  );
  console.log(homeTab.buildToJSON());
  return homeTab.buildToJSON();
};
