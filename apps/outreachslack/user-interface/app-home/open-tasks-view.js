const {
  HomeTab,
  Header,
  Divider,
  Section,
  Actions,
  Elements,
  Input,
  Bits,
  setIfTruthy,
  Blocks,
} = require("slack-block-builder");
const pluralize = require("pluralize");
const { DateTime } = require("luxon");
const {
  OPEN_TASKS,
  COMPLETED_TASKS,
  MARK_COMPLETE,
  START_CHANNEL,
  OPEN_TASK,
} = require("../../utilities/outreach_api");
const {
  formatRelative,
  parseISO,
  formatDistance,
  formatDistanceToNow,
} = require("date-fns");

const optionsData = [
  { text: OPEN_TASKS, value: OPEN_TASKS },
  { text: COMPLETED_TASKS, value: COMPLETED_TASKS },
];

const overflowOptionsData = [
  { text: MARK_COMPLETE, value: MARK_COMPLETE },
  { text: START_CHANNEL, value: START_CHANNEL },
  { text: OPEN_TASK, value: OPEN_TASK },
];

const optionBuilder = (optionsArray) => {
  return optionsArray.map((option) => ({
    text: {
      type: "plain_text",
      text: option.text,
    },
    value: option.value,
  }));
};

module.exports = (openTasks) => {
  console.log("Size: ", openTasks.length);
  const homeTab = HomeTab({
    callbackId: "tasks-home",
    privateMetaData: "open",
  }).blocks(
    Actions({ blockId: "task-creation-actions" }).elements(
      Elements.StaticSelect({ placeholder: "Choose your favorite..." })
        .actionId("app-home-task-type")
        .options(
          optionsData.map((item) =>
            Bits.Option({ text: item.text, value: item.value })
          )
        ),
      // .initialOption(setIfTruthy(selected, Bits.Option({ text: selected.name, value: selected.id }))),
      // Elements.StaticSelect({placeholder: "Select a task type"}).actionId('app-home-task-type').options(...optionBuilder(optionsData)),
      Elements.DatePicker()
        .actionId("app-home-task-type-datepicker-action")
        .initialDate(new Date())
        .placeholder("Select a date"),
      Elements.Button({ text: "Reload" })
        .value("Reload")
        .actionId("app-home-task-type-reload-button")
        .primary(true)
      // Elements.Button({ text: "Completed tasks" })
      //   .value("app-home-nav-completed")
      //   .actionId("app-home-nav-completed"),
      // Elements.Button({ text: "Create a task" })
      //   .value("app-home-nav-create-a-task")
      //   .actionId("app-home-nav-create-a-task")
    )
  );
  console.log("after block elements");
  if (openTasks.length === 0) {
    homeTab.blocks(
      Header({ text: "No open tasks" }),
      Divider(),
      Section({ text: "Looks like you've got nothing to do." })
    );
    return homeTab.buildToJSON();
  }

  const getSymbolByTaskType = (taskType) => {
    if (!taskType) {
      return ":blush:";
    }
    if (taskType === "email") {
      return ":email:";
    } else if (taskType === "call") {
      return ":calling:";
    } else if (taskType === "in_person") {
      return ":two_men_holding_hands:";
    } else if (taskType === "action_item") {
      return ":blush:";
    }
    return ":blush:";
  };

  const getTaskTitle = (title, note) => {
    if (title) {
      return title;
    } else if (note) {
      return note;
    }
    return "Generic Task";
  };

  const openTaskList = openTasks.map((task) => {
    const { attributes, id, relationships } = task;
    console.log("attributes: ", attributes);
    console.log("relationships: ", relationships);
    const { note, title, dueAt, action } = attributes;
    const taskTypeSymbol = getSymbolByTaskType(action);
    let text = `${taskTypeSymbol} ${getTaskTitle(title, note)}`;
    if (dueAt) {
      const timestamp = parseISO(dueAt);
      const readableTimeFormat = formatDistance(timestamp, new Date(), {
        addSuffix: true,
      });
      text += `\n\n\n ${readableTimeFormat}`;
    }

    return [
      Section({ text }).accessory(
        // Elements.Button({ text: "Complete Task" })
        //   .value(`${id}`)
        //   .actionId("complete-task"),
        // Elements.Button({ text: "Mark As Resolved" })
        //   .value(`${id}`)
        //   .actionId("mark-as-resolved")
        Elements.OverflowMenu()
          .actionId("app-home-task-overflow-action")
          .options(
            overflowOptionsData.map((item) => {
              const params = {
                text: item.text,
                value: `${id}`,
                description: `Hello World! ${item.text}`,
              };
              if (item.text === OPEN_TASK) {
                params.url = process.env.OUTREACH_TASK_STAGING_WEB_URL;
              }
              return Bits.Option(params);
            })
          )
      ),
      Actions({ blockId: `task-creation-actions${id}` }).elements(
        Elements.Button({ text: MARK_COMPLETE })
          .value(`${id}`)
          .actionId("app-home-task-overflow-mark-complete")
          .primary(true),
        Elements.Button({ text: START_CHANNEL })
          .value(`${id}`)
          .actionId("app-home-task-overflow-start-channel"),
        Elements.Button({ text: OPEN_TASK })
          .value(OPEN_TASK)
          .url(process.env.OUTREACH_TASK_STAGING_WEB_URL)
      ),
      Divider(),
    ];
  });

  console.log("openTaskList: ", [].concat(...openTaskList));

  console.log("beforehomeTab elements");
  homeTab.blocks(
    Header({
      text: `You have ${openTasks.length} open ${pluralize(
        "task",
        openTasks.length
      )}`,
    }),
    Divider(),
    [].concat(...openTaskList)
  );

  console.log(homeTab.buildToJSON());
  return homeTab.buildToJSON();
};
