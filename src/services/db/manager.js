import { client } from "./connect.js";
import { hashWithSalt } from "../../utils/bcrypt.js";
import dotenv from "dotenv";

dotenv.config();

//default function
export const find = async (query, collectionName, isMany = false) => {
  const collection = client.db(process.env.DB_NAME).collection(collectionName);
  let result;

  try {
    if (!isMany) {
      result = await collection.findOne(query);
    } else {
      result = collection.find(query);
    }

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const insert = async (data, collectionName, isMany = false) => {
  const collection = client.db(process.env.DB_NAME).collection(collectionName);
  console.log("inserting...");

  try {
    if (!isMany) {
      await collection.insertOne(data);
    } else {
      await collection.insertMany(data);
    }
    return console.log("insertion complete");
  } catch (err) {
    console.log(err);
    return new Error(err);
  }
};

export const update = async (
  filter,
  updateQuery,
  collectionName,
  isMany = false
) => {
  const collection = client.db(process.env.DB_NAME).collection(collectionName);

  console.log("\nupdate...\n");

  try {
    if (!isMany) {
      await collection.updateOne(filter, updateQuery);
    } else {
      await collection.updateManyMany(filter, updateQuery);
    }
    return console.log("\nupdate complete\n");
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const remove = async (query, collectionName, isMany = false) => {
  const collection = client.db(process.env.DB_NAME).collection(collectionName);
  console.log("\ndelete...\n");

  try {
    if (!isMany) {
      await collection.deleteOne(query);
    } else {
      await collection.deleteMany(query);
    }
    return console.log("deletion complete");
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//function related with user
export const createUser = async (userData) => {
  const collection = client.db(process.env.DB_NAME).collection("users");

  try {
    await collection.insertOne(userData);
    console.log("User creation is complete.");

    return;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//functino related with board
export const MgCreatePost = async (postData) => {
  const collection = client.db(process.env.DB_NAME).collection("posts");

  try {
    await collection.insertOne(postData);
    console.log("Post upload complete.");
    return;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const pagination = async (size, page, findQuery = "") => {
  const collection = client.db(process.env.DB_NAME).collection("posts");
  try {
    const count = await collection.countDocuments(findQuery ? findQuery : {});
    const cursor = collection
      .find(findQuery ? findQuery : {})
      .sort({ wr_date: -1 })
      .skip(page * size)
      .limit(+size);
    let posts = [];

    for await (let doc of cursor) {
      let recValues = Object.values(doc.recommendations);
      let recResult =
        recValues.filter((ele) => ele === 1).length -
        recValues.filter((ele) => ele === -1).length;
      let data = {
        title: doc.title,
        id: doc.id,
        nick: doc.user.nick,
        category: doc.category,
        wr_date: doc.wr_date,
        view_cnt: doc.view_cnt,
        recommendation: recResult,
      };

      posts.push(data);
    }

    const postsObj = {
      content: posts,
      page: page,
      paged: true,
      last: page === ~~(count / size),
      totalPages: Math.ceil(count / size),
      totalElements: count,
      size: 20,
      sort: false,
      first: page === 0,
      empty: !(posts.length === 0),
    };

    return postsObj;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
