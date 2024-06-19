const { addProfile, getProfile } = require("../utilities");

module.exports = async ({ payload, context, next, client }) => {
  console.log("Payload: ", payload);
  try {
    const { user } = payload;
    if (user) {
      let profile = getProfile(user);
      if (!profile) {
        const result = await client.users.profile.get({
          token: context.botToken,
          user: payload.user,
        });
        profile = { ...result.profile };
        addProfile(user, profile);
      }
      context.userProfile = profile;
    }
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
  }
  await next();
};
