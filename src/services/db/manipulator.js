import { client } from "./connect.js";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

async function get() {
  const target = client.db(process.env.DB_NAME).collection("posts");

  const cursor = target.find({}); //해당 컬렉션 데이터 다 뽑은 결과가 cursor고 이거 for await로 돌려야됨
  let arr = [];
  let i = 0;

  for await (let doc of cursor) {
    fs.writeFile(
      `./src/services/db/posts/post_${i}.json`,
      JSON.stringify(doc),
      (err) => {
        if (err) console.log(err);
        console.log("file created");
      }
    );
    i++;
  }
}

get();
