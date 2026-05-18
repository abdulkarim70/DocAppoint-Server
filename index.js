const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion } = require("mongodb");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("docdb");
    const appointmentCollection = db.collection("doctorapp");

    app.get("/appointments", async (req, res) => {
      const result = await appointmentCollection.find().toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
  }
}

run();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});