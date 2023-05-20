import { insert, read, update, remove } from "./src/db_control/mongo.js";
import signUp from "./src/sign/signUp.js";
import logIn from "./src/sign/logIn.js";
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

app.post("/api/auth/authenticate", (req, res) => {
  console.log("\n--------------------logIn--------------------\n");
  /**
   * login
   * 유효성 검사
   * 유효할 경우 토큰 발급 그 외의 경우 거부
   */
  const [id, password] = [req.body.uid, req.body.password];
  console.log(id, password);
  logIn(id, password);
  res.send("log in");
});

app.post("/api/auth/register", async (req, res) => {
  console.log("\n--------------------signUp--------------------\n");
  const isSuccess = await signUp(req.body.uid, req.body.password);

  if (isSuccess) res.send(true);
  else res.send(false);
});

app.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
