import { client } from "./client.js";
import dotenv from "dotenv";
dotenv.config();

async function changeValue() {
  const categories = [
    "humor",
    "game",
    "broadcast",
    "travel",
    "hobby",
    "economic",
    "issue",
  ];
  const target = client.db(process.env.DB_NAME).collection("posts");
  const source = client.db("sample_training").collection("posts");

  const cursor = source.find({});
  let arr = [];

  for await (let doc of cursor) {
    doc.category = categories[~~(Math.random() * categories.length)];
    doc.view_cnt = ~~(Math.random() * 100_000);
    doc.recommend = ~~(Math.random() * 1000);
    doc.content = doc.body;
    doc.wr_date = doc.date;
    doc.id = doc._id.toString();
    delete doc.date;
    delete doc._id;
    delete doc.body;

    arr.push(doc);
  }

  await target.insertMany(arr);
  console.log("done");
}

changeValue();
