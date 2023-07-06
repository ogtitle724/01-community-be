import {
  pagination,
  createPost,
  find,
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

export const sendPostDetail = async (req, res) => {
  const filter = { id: req.params.boardId };

  console.log(filter);

  try {
    const postDetail = await find(filter, "posts");
    res.json(postDetail);
  } catch (err) {
    res.sendStatus(500);
  }
};

export const uploadPost = async (req, res) => {
  if (!req.body.tokenData) {
    console.log("?");
    return res.status(500).send("유저 데이터 확인 불가");
  }
  const user = req.body.tokenData;
  delete req.body.tokenData;
  const id = String(Date.now() + ~~(Math.random() * 100000));

  const post = {
    id,
    user: { nick: user.nick, email: user.email, id: user.id },
    ...req.body,
    re_date: null,
    view_cnt: 0,
    recommend: 0,
    non_recommend: 0,
    recommendations: {},
    comments: [],
  };

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

  const filter = { id: req.query.id };
  const updateQuery = { $set: { ...post } };

  try {
    update(filter, updateQuery, "posts");
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

export const addComment = async (req, res) => {
  if (!req.body.tokenData) {
    return res.status(401).send("댓글 권한이 없습니다.");
  }

  const { postId, content, wr_date, targetComment } = req.body;
  const user = { id: req.body.tokenData.id, nick: req.body.tokenData.nick };
  const id = String(Date.now() + ~~(Math.random() * 100000));
  const commentArg = {
    id,
    postId,
    content,
    user,
    wr_date,
    recommendations: {},
    replies: [],
  };

  const filter = { id: postId };
  let updateQuery;

  if (targetComment) {
    try {
      let post = await find(filter, "posts");

      const updated = post.comments.map((comment) => {
        if (comment.id === targetComment.rootCommentId) {
          commentArg.targetComment = targetComment;
          comment.replies.push(commentArg);
          return comment;
        }
        return comment;
      });

      updateQuery = { $set: { comments: updated } };
    } catch (err) {
      console.log(err);
    }
  } else {
    updateQuery = { $addToSet: { comments: commentArg } };
  }

  try {
    update(filter, updateQuery, "posts");
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export const handleRecommend = async (req, res) => {
  const { postId, id, value } = req.body;
  const filter = { id: postId };
  let post, updateQuery;

  try {
    post = await find(filter, "posts");
  } catch (err) {
    console.log(err);
  }

  const existingValue = post.recommendations[id];

  if (existingValue === value) {
    updateQuery = {
      $set: { [`recommendations.${id}`]: 0 },
    };
  } else {
    updateQuery = {
      $set: { [`recommendations.${id}`]: value },
    };
  }

  try {
    update(filter, updateQuery, "posts");
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export const handleView = async (req, res) => {
  console.log("view");

  const postId = req.body.postId;
  const filter = { id: postId };
  const updateQuery = {
    $inc: { view_cnt: 1 },
  };

  try {
    console.log("view");
    update(filter, updateQuery, "posts");
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
