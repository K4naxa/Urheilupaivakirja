const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  return authorization && authorization.toLowerCase().startsWith("bearer ")
    ? authorization.substring(7)
    : null;
};

// checks if user has any authentication token
const isAuthenticated = (req, res, next) => {
  const token = getTokenFrom(req);

  if (!token || token === "" || token === null) {
    console.error("Authentication token missing");
    return res.status(401).json({ error: "Authentication token missing" });
  }

  try {
    const decodedToken = jwt.verify(token, config.SECRET);

    if (!decodedToken || !decodedToken.user_id) {
      console.error("Invalid token: ", decodedToken);
      return res.status(401).json({ error: "Invalid token" });
    }

    res.locals.auth = { user_id: decodedToken.user_id };
    next();
  } catch (error) {
    console.error("JWT verification error: ", error.message);
    return 0;
  }
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.SECRET);
  } catch (error) {
    console.error("Verification error in auth:", error.message);
    throw new Error("Token verification failed");
  }
};

// Get the role from token
const getRole = (req) => {
  const token = getTokenFrom(req);
  if (!token) throw new Error("No token provided");
  const decodedToken = verifyToken(token);
  return decodedToken.role;
};

const getUserId = (req) => {
  const token = getTokenFrom(req);
  if (!token) throw new Error("No token provided");
  const decodedToken = verifyToken(token);
  return decodedToken.user_id;
};

const getUserFullName = async (req) => {
  try {
    const token = getTokenFrom(req);
    if (!token) throw new Error("No token provided");

    const userId = getUserId(req);

    const role = getRole(req);

    switch (role) {
      case 1: // Teacher
        const teacher = await knex("teachers")
          .where({ user_id: userId })
          .first();
        return teacher
          ? `${teacher.first_name} ${teacher.last_name}`
          : "No name found";
      case 2: // Spectator
        const spectator = await knex("spectators")
          .where({ user_id: userId })
          .first();
        return spectator
          ? `${spectator.first_name} ${spectator.last_name}`
          : "No name found";
      case 3: // Student
        const student = await knex("students")
          .where({ user_id: userId })
          .first();
        return student
          ? `${student.first_name} ${student.last_name}`
          : "No name found";
      default:
        throw new Error("Invalid user role");
    }
  } catch (error) {
    console.error("Error retrieving user name:", error);
    throw error;
  }
};

const getEmailVerified = (req) => {
  const token = getTokenFrom(req);
  if (!token) throw new Error("No token provided");
  const decodedToken = verifyToken(token);
  return decodedToken.email_verified;
};

const createToken = (user) => {
  const userForToken = {
    email: user.email,
    user_id: user.id,
    role: user.role_id,
    email_verified: user.email_verified,
  };
  return jwt.sign(userForToken, config.SECRET);
};

module.exports = {
  isAuthenticated,
  getRole,
  getUserId,
  createToken,
  getEmailVerified,
  getUserFullName,
};
