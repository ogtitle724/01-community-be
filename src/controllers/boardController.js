import {
  pagination,
  createPost,
  update,
  remove,
} from "../services/db/manager.js";
import { hashWithSalt } from "../utils/bcrypt.js";

export const sendPosts = async (req, res) => {
  let postsObj;
  const { category, size, page } = req.query;

  if (["HOME", "BEST"].includes(category)) {
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

export const uploadPost = async (req, res) => {
  const user = req.user;
  const hashArg = new Date().toString() + req.body.title;
  const id = await hashWithSalt(hashArg);
  const post = {
    ...req.body,
    re_date: null,
    view_cnt: 0,
    recommend: 0,
    id,
    user: { nick: user.nick, email: user.email, id: user.id },
  };
  console.log(post);
  try {
    createPost(post);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export const updatePost = async (req, res) => {
  const post = {
    ...req.body,
  };

  delete post.id;

  try {
    remove({ id: req.query.id }, "posts");
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export const removePost = async (req, res) => {
  const id = req.body.id;

  try {
    remove({ id }, "posts");
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
