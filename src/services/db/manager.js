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

    result
      ? console.log(`Data exists in the collection`)
      : console.log(`Data does not exist in the collection`);

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
  query,
  updateData,
  collectionName,
  isMany = false
) => {
  const collection = client.db(process.env.DB_NAME).collection(collectionName);
  const updateDoc = {
    $set: {
      ...updateData,
    },
  };

  console.log("\nupdate...\n");

  try {
    if (!isMany) {
      await collection.updateOne(query, updateDoc);
    } else {
      await collection.updateManyMany(query, updateDoc);
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
export const createPost = async (postData) => {
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
      .skip(page * size)
      .limit(+size);
    let posts = [];

    for await (let doc of cursor) {
      posts.push(doc);
    }

    const postsObj = {
      content: posts,
      page: page,
      paged: true,
      last: page === ~~(count / size),
      totalPages: ~~((count - 1) / size) + 1,
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
