import { regenerateToken } from "../services/token/generateToken.js";

const autoLogIn = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];
  const refreshToken = req.signedCookies.refreshToken;

  if (!accessToken && refreshToken) {
    console.log("now auto login executed!");
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

export default autoLogIn;
