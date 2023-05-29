import { sample } from "../config/sample.js";
import { pagination } from "../services/dbManager/dbManager.js";

export const sendPostData = async (req, res) => {
  let postData;

  if (["home", "best"].includes(req.query.category)) {
    postData = await pagination(req.query.size, req.query.page);
  } else {
    postData = await pagination(
      req.query.size,
      req.query.page,
      req.query.category
    );
  }

  res.send(postData);
};
