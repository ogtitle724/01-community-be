import { MongoClient } from "mongodb";

export async function insert(dbName, collectionName, data) {
  const client = new MongoClient(process.env.URL);

  try {
    await client.connect();

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    try {
      await collection.insertMany([data]);
      console.log("insertion complete");
    } catch (err) {
      console.error(`ERROR: ${err}`);
    }
  } catch (err) {
    console.log("Error occurs when connecting: ", err);
  } finally {
    await client.close();
  }
}

export async function read(dbName, collectionName, findQuery) {
  const client = new MongoClient(process.env.URL);

  try {
    await client.connect();

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    try {
      const cursor = await collection.find(findQuery);
      console.log(cursor);
    } catch (err) {
      console.error(`ERROR: ${err}`);
    }
  } catch (err) {
    console.log("Error occurs when connecting: ", err);
  } finally {
    client.close();
  }
}

export async function update(dbName, collectionName, findQuery, updateDoc) {
  const client = new MongoClient(process.env.URL);

  try {
    await client.connect();

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    try {
      await collection.findOneAndUpdate(findQuery, updateDoc, {
        returnOriginal: false,
      });
    } catch (err) {
      console.error(`ERROR: ${err}`);
    }
  } catch (err) {
    console.log("Error occurs when connecting: ", err);
  } finally {
    client.close();
  }
}

export async function remove(dbName, collectionName, deleteQuery) {
  const client = new MongoClient(process.env.URL);

  try {
    await client.connect();

    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    try {
      await collection.deleteMany(deleteQuery);
    } catch (err) {
      console.error(
        `Something went wrong trying to delete documents: ${err}\n`
      );
    }
  } catch (err) {
    console.log("Error occurs when connecting: ", err);
  } finally {
    client.close();
  }
}
