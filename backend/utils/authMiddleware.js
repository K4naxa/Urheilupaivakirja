const jwt = require("jsonwebtoken");
const config = require("./config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);


const isStudent = (req, res, next) => {
  //console.log("Checking if user is student");
  if (req.user && req.user.role == '3') {
  
      return next(); // User is a student and can access the route
  }
  return res.status(403).json({ message: 'Access forbidden: students only' });
};

const isTeacher = (req, res, next) => {
  if (req.user && req.user.role === 1) { // Assuming role is stored as a number
    //console.log("User is a teacher: ", req.user);
    next();
  } else {
    return res.status(403).json({ message: 'Access forbidden: teachers only' });
  }
};

const isTeacherOrSpectator = (req, res, next) => {
  if (req.user && (req.user.role === 1 || req.user.role === 2)) { // Assuming role is stored as a number
    //console.log("User is a teacher or spectator: ", req.user);
    next();
  } else {
    return res.status(403).json({ message: 'Access forbidden: teachers only' });
  }
};


const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'Access token not found' });
  }

  jwt.verify(token, config.SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired access token' });
    }

    req.user = user; // Attach user data to req.user
    next();
  });
};

// Check if user is authenticated and extract user information from token
const isAuthenticated = (req, res, next) => {
  // get tokens from cookies
  const accessToken = req.cookies.accessToken; 
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: 'No tokens provided' });
  }

  if (accessToken) {
    // Verify access token
    jwt.verify(accessToken, config.SECRET, (err, decodedToken) => {
      if (err) {
        // On error, check if refresh token is available
        if (refreshToken) {
          return res.status(401).json({ message: 'Invalid or expired access token' });
        } else {
          return res.status(401).json({ message: 'No refresh token' });
        }
      }

      req.user = decodedToken; // req.user contains user information from the token
      //console.log("User authenticated: ", req.user);
      next();
    });
  } else if (refreshToken) {
    // Only refresh token is available, user should refresh the access token
    return res.status(401).json({ message: 'Access token missing' });
  }
};


module.exports = {
  isStudent,
  isTeacher,
  isTeacherOrSpectator,
  authenticateToken,
  isAuthenticated
};
