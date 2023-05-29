import { client } from "./dbClient.js";
import dotenv from "dotenv";
dotenv.config();

export async function pagination(size, page, category = "") {
  const collection = client.db(process.env.DB_NAME).collection("posts");
  try {
    const count = await collection.countDocuments(
      category ? { category: category } : {}
    );
    const cursor = collection
      .find(category ? { category: category } : {})
      .skip(page * size)
      .limit(20);
    let posts = [];

    for await (let doc of cursor) {
      posts.push(doc);
    }

    const postData = {
      content: posts,
      page: page,
      paged: true,
      last: page === ~~(count / size),
      totalPages: ~~(count / size),
      totalElements: count,
      size: 20,
      sort: false,
      first: page === 0,
      empty: !(posts.length === 0),
    };

    return postData;
  } catch (err) {
    console.error("Error read MongoDB:", err);
  }
}
