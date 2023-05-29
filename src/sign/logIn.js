import { read } from "../config/database.js";

export default async function logIn(id, pwd) {
  const user = await read("TEST", "user", { eMail: id }, true);
  console.log("login:", user);
}
