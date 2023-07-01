import { Mutex } from "async-mutex";
import { find, remove, createUser } from "../services/db/manager.js";
import { compare, hashWithSalt } from "../utils/bcrypt.js";
import {
  generateTokens,
  regenerateToken,
} from "../services/token/generateToken.js";
import { sendMailTo } from "../services/mail/mail.js";

export const signUp = async (req, res) => {
  console.log("signup processing");
  const { email, nick, pwd, uid } = req.body;

  const hashedPwd = await hashWithSalt(pwd);
  const now = new Date().toString();

  req.body.pwd = hashedPwd;
  req.body.id = await hashWithSalt(now);
  req.body["join_date"] = now;

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
      const tokens = await generateTokens(userData);

      res
        .status(200)
        .cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          signed: true,
        })
        .set({
          Authorization: `Bearer ${tokens.accessToken}`,
          "Access-Control-Expose-Headers": "Authorization", //explicitly inform to expose auth header
        })
        .json(userData.id);
    } else {
      throw new Error("passowrd does not match");
    }
  } catch (err) {
    console.log("-------------------------------------------------gen");

    console.error("signin:", err);
    res.status(403).json({ message: "Access forbidden" });
  }
};

export const refresh = async (req, res) => {
  console.log("-------------------------------------------");
  console.log("silent refresh executed");
  try {
    const refreshToken = req.signedCookies.refreshToken;

    if (refreshToken) {
      const result = await regenerateToken(refreshToken);
      const newAccessToken = result.accessToken;
      console.log("-------------------------------------------");
      console.log("newAccessToken:", newAccessToken);
      res
        .status(200)
        .set({
          Authorization: `Bearer ${newAccessToken}`,
          "Access-Control-Expose-Headers": "Authorization", //explicitly inform to expose auth header
        })
        .send("refresh accessToken complete");
    } else {
      res.status(401).send("no valid refresh token");
    }
  } catch (err) {
    console.log(err);
    res.status(401).send(err);
  }
};

export const logOut = async (req, res) => {
  try {
    const refreshToken = req.signedCookies.refreshToken;
    await remove({ token: refreshToken }, "refresh_tokens");
    console.log("delete refresh token completed");
    res
      .status(200)
      .clearCookie("refreshToken", {
        httpOnly: true,
        signed: true,
      })
      .send("user logout");
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
};

let verificationCodes = new Set();
const expirationTime = 1000 * 60 * 4;
const mutex = new Mutex();

export const generateCode = async (req, res) => {
  console.log("generate code");
  const { email } = req.body.email;
  let code = ~~(100000 * Math.random());

  while (verificationCodes.has(code)) {
    code = ~~(100000 * Math.random());
  }

  const release = await mutex.acquire();

  try {
    verificationCodes.add(code);

    setTimeout(() => {
      mutex.runExclusive(() => verificationCodes.delete(code));
    }, expirationTime);

    /* sendMailTo(email, code); */
    res.json(code).status(200);
  } catch (err) {
    console.log(err);
  } finally {
    release();
  }
};

export const verifyCode = async (req, res) => {
  console.log("verify code");
  const code = req.body.authCode;

  if (verificationCodes.has(code)) {
    mutex.runExclusive(() => verificationCodes.delete(code));
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
};
