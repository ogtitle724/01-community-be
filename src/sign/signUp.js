import { include, insert } from "../db_control/mongo.js";
import bcrypt from "bcrypt";

export default async function signUp(id, pwd) {
  console.log("user email:", id);
  try {
    const existence = await include("TEST", "user", { eMail: id });
    console.log("isInclude: ", existence);

    if (!existence) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(pwd, salt);
      const user = { eMail: id, password: hashedPassword };
      insert("TEST", "user", user);

      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log("s", err);
    return false;
  }
}
