const express = require("express");
const session = require("express-session");
const taskRoutes = require("./routes/taskRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.ADMIN_PASSWORD, // Replace with your session secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use("/api", taskRoutes);
app.use("/admin", adminRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
