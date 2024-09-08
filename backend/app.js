require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var registerRouter = require("./routes/user/registerRouter.js");
var userRouter = require("./routes/user/userRouter.js");
var authRouter = require("./routes/user/authRouter.js");

var studentRouter = require("./routes/role/studentRouter.js");
var spectatorRouter = require("./routes/role/spectatorRouter.js");
var teacherRouter = require("./routes/role/teacherRouter.js");

var publicRouter = require("./routes/misc/publicRouter.js");
var campusRouter = require("./routes/misc/campusRouter.js");
var groupRouter = require("./routes/misc/groupRouter.js");
var newsRouter = require("./routes/misc/newsRouter.js");
var journalRouter = require("./routes/misc/journalRouter.js");
var sportRouter = require("./routes/misc/sportRouter.js");
var courseRouter = require("./routes/misc/courseRouter.js");
var statisticsRouter = require("./routes/misc/statisticsRouter.js");
var unverifiedRouter = require("./routes/misc/unverifiedRouter.js");

var app = express();

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "build")));


app.use("/spectator", spectatorRouter);
app.use("/auth", authRouter);
app.use("/campus", campusRouter);
app.use("/group", groupRouter);
app.use("/news", newsRouter);
app.use("/sport", sportRouter);
app.use("/journal", journalRouter);
app.use("/course", courseRouter);
app.use("/statistics", statisticsRouter);
app.use("/unverified", unverifiedRouter);
app.use("/user", userRouter);
app.use("/register", registerRouter);
app.use("/student", studentRouter);
app.use("/teacher", teacherRouter);
app.use("/public", publicRouter);




app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

module.exports = app;
