import { ObjectId } from "mongodb";
import { connectToDb } from "../../../util/mongodb"; //very very important

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const { db } = await connectToDb();

  if (method === "DELETE") {
    try {
      await db.collection("posts").deleteOne({ _id: new ObjectId(id) }); //very very important
      res.status(200).json({ message: "Post deleted" });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
