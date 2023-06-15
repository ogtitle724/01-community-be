import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { insert, find } from "../db/manager.js";

dotenv.config();

export const generateTokens = async (userData) => {
  if (typeof userData !== "object") return console.log("Not valid input data");

  try {
    delete userData.pwd, userData._id;
    userData = { ...userData, timestamp: Date.now() };

    const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });

    await insert({ token: refreshToken }, "refresh_tokens");

    return { accessToken, refreshToken };
  } catch (err) {
    console.log("-------------------------------------------------gen");
    console.error("gen:", err);
    throw err;
  }
};

export const regenerateToken = async (refreshToken) => {
  try {
    const isTokenValid = await find({ token: refreshToken }, "refresh_tokens");

    if (!isTokenValid) throw new Error("Not valid refreshToken");

    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, tokenData) => {
          if (err) {
            console.error(err);
            reject(err);
          }

          const newTokenData = {
            ...tokenData,
            timestamp: Date.now(),
          };

          const accessToken = jwt.sign(
            newTokenData,
            process.env.ACCESS_TOKEN_SECRET
          );
          console.log("regenerated token:", accessToken);
          resolve({ accessToken });
        }
      );
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};
