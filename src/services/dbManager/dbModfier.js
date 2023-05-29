import { client } from "./dbClient.js";
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
    doc["wr_date"] = doc.date;
    delete doc.date;

    arr.push(doc);
  }
  console.log(arr[0]);
  await target.insertMany(arr);
  console.log("done");
}

changeValue();
