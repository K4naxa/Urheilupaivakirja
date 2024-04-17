require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var { isAuthenticated } = require("./middleware/auth");

var indexRouter = require("./routes/index");
var loginRouter = require("./routes/user/loginRouter.js");
var registerRouter = require("./routes/user/registerRouter.js");
var journalRouter = require("./routes/journalRouter.js");
var sportsRouter = require("./routes/sportsRouter.js");
var unverifiedRouter = require("./routes/user/unverifiedRouter.js");
var verifyRouter = require("./routes/user/verifyRouter.js");
var userRouter = require("./routes/user/userRouter.js");
var publicRouter = require("./routes/publicRouter.js");
var journalEntryRouter = require("./routes/journalEntryRouter.js");
var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/user/verify", isAuthenticated, verifyRouter);
app.use("/user/login", loginRouter);
app.use("/user/register", registerRouter);
app.use("/user/unverified", isAuthenticated, unverifiedRouter);
app.use("/journal", isAuthenticated, journalRouter);
app.use("/sports", isAuthenticated, sportsRouter);
app.use("/public", publicRouter);
app.use("/public/groups", isAuthenticated, publicRouter);
app.use("/journal_entry", isAuthenticated, journalEntryRouter);

module.exports = app;