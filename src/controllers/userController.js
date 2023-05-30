import { find, createUser } from "../services/db/manager.js";
import { compare } from "../utils/bcrypt.js";
import { generateTokens } from "../services/auth/generateToken.js";

export const signUp = async (req, res) => {
  const { email, emailReceive, nick, pwd, uid } = req.body;

  console.log("signup processing...");

  try {
    if (await find({ email }, "users"))
      throw new Error("this email is already in use");
    if (await find({ nick }, "users"))
      throw new Error("this nickname is already in use");
    if (await find({ uid }, "users"))
      throw new Error("this id is already in use");

    console.log("insert user data to database...");

    await createUser(req.body);

    res.sendStatus(200);
  } catch (err) {
    return err;
  }
};

export const signIn = async (req, res) => {
  const { pwd, uid } = req.body;

  try {
    const userData = await find({ uid }, "users");

    if (!userData) throw Error("there is no corresponding user data");

    const isPwdMatch = await compare(pwd, userData.pwd);

    if (isPwdMatch) {
      const tokens = generateTokens(userData);

      res.status(200).send(tokens);
    } else {
      throw new Error("passowrd does not match");
    }
  } catch (err) {
    console.log("-------------------------------------------------gen");

    console.error("signin:", err);
    res.status(403).json({ message: "Access forbidden" });
  }
};
