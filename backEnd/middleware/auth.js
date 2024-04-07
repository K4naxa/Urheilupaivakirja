const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  return authorization && authorization.toLowerCase().startsWith("bearer ")
    ? authorization.substring(7)
    : null;
};

const isAuthenticated = (req, res, next) => {
  const token = getTokenFrom(req);

  if (!token) {
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
    return res.status(401).json({ error: "Token verification failed" });
  }
};

module.exports = isAuthenticated;