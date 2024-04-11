const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  return authorization && authorization.toLowerCase().startsWith("bearer ")
    ? authorization.substring(7)
    : null;
};

// Get role from token
const getRole = (req) => {
  const token = getTokenFrom(req);
  let role = null;
  try {
    const decodedToken = jwt.verify(token, config.SECRET);
    role = decodedToken.role;
  } catch (error) {
    console.error("JWT verification error in sportsR : ", error.message);
    return res.status(401).json({ error: "Token verification failed" });
  }
  return role;
};

module.exports = getRole;
// Path: backEnd/middleware/getRole.js
