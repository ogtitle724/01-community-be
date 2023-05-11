import { insert, read, update, remove } from "./src/db_control/mongo.js";
import dotenv from "dotenv";
import qs from "qs";
import cors from "cors";
import express from "express";

dotenv.config();

const app = express();
app.use(express.json()); // parsing application/json
app.use(express.urlencoded({ extended: true }));
/** parsing application/x-wwww-form-urlencoded
 * extended indicates whether the qs module is used. */

app.use(cors());

app.get("/search", (req, res) => {
  const query = qs.parse(req.query);
  res.send(req.body);
});

app.post("/process_login", (req, res) => {
  res.send("log in");
});

app.post("/process_signup", (req, res) => {
  insert("TEST", "user", req.body);

  res.send();
});

app.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
