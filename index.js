const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
  try {
    const email = req.query.email; 
    
    let query = {};
    if (email) {
      query = { userEmail: email }; 
    }

    const result = await appointmentCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});





    
app.get('/appointments/:id',async(req, res)=>{
const id=req.params.id
const query={_id: new ObjectId(id)}
const result=await appointmentCollection.findOne(query)
res.send(result)
})
app.post("/appointments", async (req, res) => {
  try {
    const bookingData = req.body; 
    
   
    const result = await appointmentCollection.insertOne(bookingData);
    
   
    res.status(201).send({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("Error saving appointment:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

app.delete('/appointments/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    
    const result = await appointmentCollection.deleteOne(query);
    
    if (result.deletedCount === 1) {
      res.send({ success: true, message: "Successfully deleted one document." });
    } else {
      res.status(404).send({ success: false, message: "No document matches the provided ID." });
    }
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});
app.put('/appointments/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body; 
    const filter = { _id: new ObjectId(id) };
    
    
    const updateDoc = {
      $set: {
        patientName: updatedData.patientName,
        gender: updatedData.gender,
        phone: updatedData.phone,
        date: updatedData.date,
        time: updatedData.time,
        reason: updatedData.reason,
      },
    };

    const result = await appointmentCollection.updateOne(filter, updateDoc);
    
    if (result.modifiedCount === 1 || result.matchedCount === 1) {
      res.send({ success: true, message: "Successfully updated the appointment." });
    } else {
      res.status(404).send({ success: false, message: "No changes made or document not found." });
    }
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
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