import { pagination } from "../services/db/manager.js";

export const sendPosts = async (req, res) => {
  let postsObj;
  const { category, size, page } = req.query;

  if (["home", "best"].includes(category)) {
    postsObj = await pagination(size, page);
  } else {
    postsObj = await pagination(size, page, category);
  }

  res.send(postsObj);
};
