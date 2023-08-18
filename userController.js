import { MongoClient } from "mongodb";

export async function registerUser(lastname, password) {
  try {
    const client = new MongoClient("mongodb://localhost:27017", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db("tuBaseDeDatos");

    const user = {
      lastname,
      password,
    };
    const result = await db.collection("users").insertOne(user);

    await client.close();

    return user;
  } catch (error) {
    throw error;
  }
}
