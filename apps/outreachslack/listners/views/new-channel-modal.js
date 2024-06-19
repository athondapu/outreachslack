const { size } = require("lodash");
const { channelModals } = require("../../user-interface/modals");

const newChannelModalCallback = async ({ ack, view, body, client }) => {
  const providedValues = view.state.values;

  const channelName = providedValues.channelName.channelName.value;

  const selectedUsers =
    providedValues.channelAssignUsers.channelAssignUsers.selected_users;

  const errors = {};
  if (!channelName) {
    errors["channelName"] = "Please set a channel name to create";
  }

  if (selectedUsers && size(selectedUsers) <= 1) {
    errors["channelAssignUsers"] =
      "Please select atleast two users to create a channel";
  }
  if (size(errors) > 0) {
    await ack({
      response_action: "errors",
      errors: errors,
    });
    return;
  }

  try {
    // Create a channel
    const result = await client.conversations.create({
      name: channelName,
    });
    console.log(result);
    const channelId = result.channel.id;

    // Invite users to the channel
    const userIdArray = selectedUsers.map((userId) => userId.trim());
    console.log("userIdArray: ", userIdArray);
    await client.conversations.invite({
      channel: channelId,
      users: userIdArray.join(","),
    });

    // Send a confirmation message
    await client.chat.postMessage({
      channel: body.user.id,
      text: `Channel <#${channelId}> created and users invited successfully!`,
    });
    await ack({
      response_action: "update",
      view: channelModals.channelCreated(channelName),
    });
  } catch (error) {
    console.error(error.data);
    
    await ack({
      response_action: "update",
      view: channelModals.channelCreationError(channelName, error),
    });
  }

  // try {
  //   // Grab the creating user from the DB
  //   const queryResult = await User.findOrCreate({
  //     where: {
  //       slackUserID: body.user.id,
  //       slackWorkspaceID: body.team.id,
  //     },
  //   });
  //   const user = queryResult[0];

  //   // Grab the assignee user from the DB
  //   const querySelectedUser = await User.findOrCreate({
  //     where: {
  //       slackUserID: selectedUser,
  //       slackWorkspaceID: body.team.id, // TODO better compatibility with Slack Connect.
  //     },
  //   });
  //   const selectedUserObject = querySelectedUser[0];

  //   // Persist what we know about the task so far
  //   await task.save();
  //   await task.setCreator(user);
  //   await task.setCurrentAssignee(selectedUserObject);

  //   if (task.dueDate) {
  //     const dateObject = DateTime.fromJSDate(task.dueDate);
  //     // The `chat.scheduleMessage` endpoint only accepts messages in the next 120 days,
  //     // so if the date is further than that, don't set a reminder, and let the user know.
  //     const assignee = await task.getCurrentAssignee();
  //     if (dateObject.diffNow('days').toObject().days < 120) {
  //       await client.chat
  //         .scheduleMessage(
  //           taskReminder(
  //             dateObject.toSeconds(),
  //             assignee.slackUserID,
  //             task.title,
  //             dateObject.toRelativeCalendar(),
  //             task.id,
  //           ),
  //         )
  //         .then(async (response) => {
  //           task.scheduledMessageId = response.scheduled_message_id;
  //           await task.save();
  //         });
  //     } else {
  //       // TODO better error message and store it in /user-interface
  //       await client.chat.postMessage({
  //         text: `Sorry, but we couldn't set a reminder for ${taskTitle}, as it's more than 120 days from now`,
  //         channel: assignee.slackUserID,
  //       });
  //     }
  //   }
  //   await task.save();
  //   await ack({
  //     response_action: 'update',
  //     view: modals.taskCreated(taskTitle),
  //   });
  //   if (selectedUser !== body.user.id) {
  //     await client.chat.postMessage({
  //       channel: selectedUser,
  //       text: `<@${body.user.id}> assigned you a new task:\n- *${taskTitle}*`,
  //     });
  //     await reloadAppHome(client, selectedUser, body.team.id);
  //   }

  //   await reloadAppHome(client, body.user.id, body.team.id);
  // } catch (error) {
  //   await ack({
  //     response_action: 'update',
  //     view: modals.taskCreationError(taskTitle),
  //   });
  //   // eslint-disable-next-line no-console
  //   console.error(error);
  // }
};

module.exports = { newChannelModalCallback };
