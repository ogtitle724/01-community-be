import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.URL;
const client = new MongoClient(url);

const connectDB = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Export the connectDB function and the client
export { connectDB, client };
