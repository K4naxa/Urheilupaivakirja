const config = require("./config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

const getUserFullName = async (userId) => {
    try {
      // First, get the role and token from the user record
      const user = await knex("users")
        .select("role_id")
        .where({ id: userId })
        .first();
      
      if (!user) {
        return "User not found";
      }
      const role = user.role_id;

      // Proceed based on role
      let userInfo;
      switch (role) {
        case 1: // Teacher
          userInfo = await knex("teachers")
            .where({ user_id: userId })
            .first();
          break;
        case 2: // Spectator
          userInfo = await knex("spectators")
            .where({ user_id: userId })
            .first();
          break;
        case 3: // Student
          userInfo = await knex("students")
            .where({ user_id: userId })
            .first();
          break;
        default:
          return "Invalid user role";
      }

      // Return full name if user info is available
      return userInfo
        ? `${userInfo.first_name} ${userInfo.last_name}`
        : "No name found";
      
    } catch (error) {
      console.error("Error retrieving user name:", error);
      throw error;
    }
  };


  module.exports = { getUserFullName };