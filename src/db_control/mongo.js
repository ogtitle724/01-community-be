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

export async function read(
  dbName,
  collectionName,
  findQuery,
  isFindOne = false
) {
  const client = new MongoClient(process.env.URL);

  try {
    await client.connect();

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    try {
      if (isFindOne) {
        return await collection.findOne(findQuery);
      } else {
        const cursor = collection.find(findQuery);
        let arr = [];

        for await (const doc of cursor) {
          arr.push(doc);
        }

        return arr;
      }
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
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
    await client.close();
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
    await client.close();
  }
}

export async function include(dbName, collectionName, findQuery) {
  const client = new MongoClient(process.env.URL);

  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    try {
      const result = await collection.findOne(findQuery);
      console.log("findResult: ", result);

      if (result) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}
