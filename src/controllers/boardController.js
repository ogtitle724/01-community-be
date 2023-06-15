import { pagination } from "../services/db/manager.js";

export const sendPosts = async (req, res) => {
  let postsObj;
  const { category, size, page } = req.query;

  if (["home", "best"].includes(category)) {
    postsObj = await pagination(size, page);
  } else {
    postsObj = await pagination(size, page, { category });
  }

  res.status(200).json(postsObj);
};

export const sendFilteredPost = async (req, res) => {
  const { size, page, term } = req.query;
  const postsObj = await pagination(size, page, {
    title: { $regex: term, $options: "i" },
    content: { $regex: term, $options: "i" },
  });

  res.status(200).json(postsObj);
};
