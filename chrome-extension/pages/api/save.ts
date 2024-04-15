import { MongoClient, ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import { generateUUID } from "../../utils/utils"

const allowedMethods = ["POST"]


export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
}

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query

  res.status(200).json({ id })
  return
}

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  // { url, data,title,html,tree,description,linked_data }
  const body =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body
  const dbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017"
  const client = new MongoClient(dbUrl)
  const dbName = "synesthesia-studio"
  await client.connect()
  const db = client.db(dbName)
  const collection = db.collection("Object")
  const uuid = generateUUID()
  const insertion = await collection.insertOne({
    id: uuid,
    type: "webpage",
    payload: { 
      id: uuid,
      _id: new ObjectId(uuid.split('-').join('').slice(0, 24)),
      // url, 
      // data,
      // title,
      // html,
      // tree,
      created_at: new Date(),
      ...body
      // description,
      // linked_data
    }
  })
  await client.close()



  res.status(200).json(insertion)
  return
}

const put = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = typeof req.body === "string" ? JSON.parse(req.body) : req.body
  res.status(200).json({ id })
  return
}

const del = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = typeof req.body === "string" ? JSON.parse(req.body) : req.body
  res.status(200).json({ id })
  return
}

const requestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!allowedMethods.includes(req.method as string)) {
    res.status(405).json({ message: "Method not allowed" })
    return
  }

  switch (req.method) {
    case "GET":
      await get(req, res)
      return
    case "POST":
      await post(req, res)
      return
    case "PUT":
      await put(req, res)
      return
    case "DELETE":
      await del(req, res)
      return
    default:
      break
  }
}
export default requestHandler
