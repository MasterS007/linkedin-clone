import { Timestamp } from "mongodb";
import { connectToDb } from "../../../util/mongodb";

export default async function handler(req, res) {
  const { method, body } = req;
  const { db } = await connectToDb();

  if (method === "GET") {
    try {
      const posts = await db
        .collection("posts")
        .find()
        .sort({ timestamp: -1 })
        .toArray();

      res.status(200).json(posts);
    } catch (err) {
      // console.log(err);
      res.status(500).json(err);
    }
  }

  if (method === "POST") {
    try {
      const post = await db
        .collection("posts")
        .insertOne({ ...body, timestamp: new Timestamp() });

      res.status(201).json(post);
    } catch (err) {
      //console.log(err);
      res.status(500).json(err);
    }
  }
}
