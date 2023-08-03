//imports
const express = require("express");
const admin = require("firebase-admin");
const multer = require("multer");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

//middleware
// app.use(express.json());
app.use(cors());
// app.use(multer({ dest: "uploads/" }).single("file"));
app.use(multer({ dest: "uploads/" }).array("files", 10));
dotenv.config();
const port = process.env.SERVER_PORT || 5000;

//initialize firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

//import database connection
const { connect } = require("./database/db");
const routes = require("./routes/routes");
app.use(routes);

//starting the server
async function start() {
  try {
    await connect();
    console.log("Connected to database");

    app.get("/", (req, res) => {
      res.send("welcome to the server");
      console.log("welcome to the server");
    });

    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

start();
