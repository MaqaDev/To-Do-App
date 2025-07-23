require("dotenv").config();
const port = process.env.port;
const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const routes = require(path.join(__dirname, "routes", "taskRouter"));

const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI);
async function DbConnect() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("baglandi");
    console.log(mongoose.connection.db.databaseName);
    app.listen(port, () => {
      console.log(`app listens to port ${port}`);
    });
  } catch (error) {
    console.log("error :", error);
    await mongoose.disconnect();
  }
}

DbConnect();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "public", "index.html"));
});
app.use("/api", routes);
