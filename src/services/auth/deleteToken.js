import dotenv from "dotenv";
import { remove } from "../db/manager.js";

dotenv.config();

export const deleteToken = async (refreshToken) => {
  try {
    await remove({ token: refreshToken }, "refresh_token");
  } catch (err) {
    console.error(err);
    throw err;
  }
};
