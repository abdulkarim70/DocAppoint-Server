const express = require('express')
const app = express()
const dotenv=require('dotenv')
dotenv.config()
const port = process.env.PORT || 8080


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    await client.connect();
   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
    // await client.close();
  }
}
run().catch(console.dir);

const db= client.db('docdb');
const appointmentCollection=db.collection('doctorapp')



app.get('/appointments',async(req, res)=>{
const cursor= await appointmentCollection.find()
const result= await cursor.toArray()
res.send(result)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
