import jwt from "jsonwebtoken";
import { regenerateToken } from "../services/token/generateToken.js";

export const autoLogIn = async (req, res, next) => {
  console.log("initial process 1 executed");
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];
  const refreshToken = req.signedCookies.refreshToken;

  if (!accessToken && refreshToken) {
    console.log("\n\nauto login executed\n");
    try {
      const regenerated = await regenerateToken(refreshToken);
      const newAccessToken = regenerated.accessToken;

      res.set({
        Authorization: `Bearer ${newAccessToken}`,
        "Access-Control-Expose-Headers": "Authorization",
        "Cache-Control": "no-store",
      });

      req.headers.authorization = `Bearer ${newAccessToken}`;
    } catch (err) {
      console.log(err);
    }
  }

  next();
};

export const verifyToken = (req, res, next) => {
  console.log("initial process 2 executed");
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (accessToken) {
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      (err, tokenData) => {
        if (err) console.error(err);
        console.log(tokenData);
        req.body.tokenData = tokenData;
      }
    );
  }

  next();
};
