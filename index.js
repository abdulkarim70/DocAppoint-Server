const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

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

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  next();
};

async function run() {
  try {
    await client.connect();

    const db = client.db("docdb");
    const appointmentCollection = db.collection("doctorapp");

  
    
    app.get("/doctors", async (req, res) => {
      try {
       
        const result = await appointmentCollection.find({ specialty: { $exists: true } }).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    

   
    app.get("/appointments", async (req, res) => {
      try {
        const email = req.query.email;

        
        let query = { userEmail: { $exists: true } };
        
        if (email) {
          query.userEmail = email; 
        }

        const result = await appointmentCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    // GET single appointment by ID
    app.get("/appointments/:id", async (req, res) => {
      try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: "Invalid ID" });
        }

        const query = { _id: new ObjectId(id) };
        const result = await appointmentCollection.findOne(query);

        if (!result) {
          return res.status(404).send({ message: "Not found" });
        }

        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Server error" });
      }
    });

    // POST a new appointment
    app.post("/appointments", async (req, res) => {
      try {
        const bookingData = req.body;

        const result = await appointmentCollection.insertOne(bookingData);

        res.status(201).send({
          success: true,
          insertedId: result.insertedId,
        });
      } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    // DELETE an appointment
    app.delete("/appointments/:id", async (req, res) => {
      try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: "Invalid ID" });
        }

        const result = await appointmentCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 1) {
          res.send({ success: true });
        } else {
          res.status(404).send({ success: false });
        }
      } catch (error) {
        res.status(500).send({ message: "Server error" });
      }
    });

    // PUT (Update) an appointment
    app.put("/appointments/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedData = req.body;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: "Invalid ID" });
        }

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

        res.send({
          success: true,
          modifiedCount: result.modifiedCount,
        });
      } catch (error) {
        res.status(500).send({ message: "Server error" });
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