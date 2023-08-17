import {
  pagination,
  MgCreatePost,
  find,
  update,
  remove,
} from "../services/db/manager.js";

export const readPosts = async (req, res) => {
  let postsObj;
  const category = req.params.category;
  const { size, page } = req.query;

  if (category === "홈") {
    postsObj = await pagination(size, page);
  } else {
    postsObj = await pagination(size, page, { category });
  }

  res.status(200).json(postsObj);
};

export const getFilteredPosts = async (req, res) => {
  const { size, page, term } = req.query;
  const postsObj = await pagination(size, page, {
    title: { $regex: term, $options: "i" },
  });

  res.status(200).json(postsObj);
};

export const createPost = async (req, res) => {
  if (!req.body.tokenData) {
    return res.status(500).send("유저 데이터 확인 불가");
  }

  const user = req.body.tokenData;
  delete req.body.tokenData;
  const id = String(Date.now() + ~~(Math.random() * 100000));

  const post = {
    id,
    ...req.body,
    wr_date: new Date(),
    re_date: null,
    del_date: null,
    view_cnt: 0,
    user_id: user.id,
    user_nick: user.nick,
    recommend_cnt: 0,
    decommend_cnt: 0,
    recommend_state: 0,
    recommendations: {},
    comments: [],
  };

  try {
    MgCreatePost(post);
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

  const filter = { id: req.params.postId };
  const updateQuery = { $set: { ...post } };

  try {
    update(filter, updateQuery, "posts");
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export const readPost = async (req, res) => {
  const filter = { id: req.params.postId };

  try {
    const postDetail = await find(filter, "posts");
    res.json(postDetail);
  } catch (err) {
    res.sendStatus(500);
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.postId;

  try {
    remove({ id }, "posts");
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export const setPostRec = async (req, res) => {
  const id = req.body.tokenData.id;
  const postId = req.params.postId;
  const { value } = req.body;
  const filter = { id: postId };
  let post, updateQuery;

  console.log(id, postId, value);

  try {
    post = await find(filter, "posts");
  } catch (err) {
    console.log(err);
  }

  const existingValue = post.recommendations?.[id];

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
  const postId = req.body.postId;
  const filter = { id: postId };
  const updateQuery = {
    $inc: { view_cnt: 1 },
  };

  try {
    update(filter, updateQuery, "posts");
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

  const { content, targetNick } = req.body;
  const { postId, commentId } = req.params;
  const id = String(Date.now() + ~~(Math.random() * 100000));
  const commentArg = {
    id,
    content,
    wr_date: new Date(),
    del_date: null,
    user_id: req.body.tokenData.id,
    user_nick: req.body.tokenData.nick,
    recommend_cnt: 0,
    decommend_cnt: 0,
    recommendations: {},
    replies: [],
  };

  const filter = { id: postId };
  let updateQuery;

  if (commentId) {
    try {
      let post = await find(filter, "posts");

      const updated = post.comments.map((comment) => {
        if (comment.id === commentId) {
          commentArg.target_nick = targetNick;
          comment.replies.push(commentArg);
          return comment;
        }
        return comment;
      });

      delete updated.replies;

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

export const updateComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
  const findQuery = { id: postId };
  try {
    let post = await find(findQuery, "posts");
    let comments = post.comments;
    let isConverted = false;

    outer: for (let i = 0; i < comments.length; i++) {
      if (comments[i].id === commentId) {
        comments[i].content = content;
        isConverted = true;
        break;
      }

      let replies = comments[i].replies;

      if (replies && replies.length) {
        for (let j = 0; j < replies.length; j++) {
          if (replies[j].id === commentId) {
            replies[j].content = content;
            isConverted = true;
            break outer;
          }
        }
      }
    }

    if (!isConverted)
      throw Error("Error: change description before update failed");

    let updateQuery = { $set: { comments } };

    await update(findQuery, updateQuery, "posts");

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const findQuery = { id: postId };
  try {
    let post = await find(findQuery, "posts");
    let comments = post.comments;
    let isConverted = false;

    outer: for (let i = 0; i < comments.length; i++) {
      if (comments[i].id === commentId) {
        comments[i].content = "<span> <i>삭제된 댓글입니다...<.i> <span>";
        comments[i].del_date = new Date();
        isConverted = true;
        break;
      }

      let replies = comments[i].replies;

      if (replies && replies.length) {
        for (let j = 0; j < replies.length; j++) {
          if (replies[j].id === commentId) {
            replies[j].content = "<span> <i>삭제된 댓글입니다...</i> <span>";
            replies[j].del_date = new Date();
            isConverted = true;
            break outer;
          }
        }
      }
    }

    if (!isConverted)
      throw Error("Error: change before update description failed");
    let updateQuery = { $set: { comments } };

    await update(findQuery, updateQuery, "posts");

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export const setCommendRec = async (req, res) => {
  const id = req.body.tokenData.id;
  const { postId, commentId } = req.params;
  const { value } = req.body;
  const findQuery = { id: postId };

  try {
    let post = await find(findQuery, "posts");
    let comments = post.comments;

    outer: for (let i = 0; i < comments.length; i++) {
      if (comments[i].id === commentId) {
        let currValue = comments[i].recommendations[id];

        if (currValue === value) comments[i].recommendations[id] = 0;
        else comments[i].recommendations[id] = value;

        comments[i].recommend_cnt = comments[i].recommendations.filter(
          (ele) => ele === 1
        ).length;
        comments[i].decommend_cnt = comments[i].recommendations.filter(
          (ele) => ele === -1
        ).length;

        break;
      }

      let replies = comments[i].replies;

      if (replies && replies.length) {
        for (let j = 0; j < replies.length; j++) {
          if (replies[i].id === commentId) {
            let currValue = replies[i].recommendations[id];

            if (currValue === value) replies[i].recommendations[id] = 0;
            else replies[i].recommendations[id] = value;

            replies[i].recommend_cnt = replies[i].recommendations.filter(
              (ele) => ele === 1
            ).length;
            replies[i].decommend_cnt = replies[i].recommendations.filter(
              (ele) => ele === -1
            ).length;

            break outer;
          }
        }
      }
    }

    let updateQuery = { $set: { comments } };

    await update(findQuery, updateQuery, "posts");
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
