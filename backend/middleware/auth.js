const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  return authorization && authorization.toLowerCase().startsWith("bearer ")
    ? authorization.substring(7)
    : null;
};

// checks if user has any authentication token
const isAuthenticated = (req, res, next) => {
  const token = getTokenFrom(req);
  console.log("Token: ", token);

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

// Get the role from token
const getRole = (req) => {
  const token = getTokenFrom(req);
  let role = null;
  try {
    const decodedToken = jwt.verify(token, config.SECRET);
    role = decodedToken.role;
  } catch (error) {
    console.error("GetRole Verification error in auth : ", error.message);
    return res.status(401).json({ error: "Token verification failed" });
  }
  return role;
};

const getUserId = req => {
  const token = getTokenFrom(req);
  let userId = null;
  try {
    const decodedToken = jwt.verify(token, config.SECRET);
    userId = decodedToken.user_id;
  } catch (error) {
    console.error("GetUserId Verification error in auth : ", error.message);
    return res.status(401).json({ error: "Token verification failed" });
  }
  return userId;

}

module.exports = { isAuthenticated, getRole, getUserId };
