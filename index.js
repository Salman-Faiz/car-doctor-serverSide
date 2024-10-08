const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
console.log(process.env.DB_PASS);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pc8mx8l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // create collection to find multiple data from mongodb
    const serviceCollection = client.db("carDoctor").collection("Services");
    const checkOutCollection = client.db("carDoctor").collection("checkout");
    // get data  from mongoDB
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // get specific data from database using find
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      //
      const options = {
        // Include only the `title` and `services` fields in the returned document
        projection: { title: 1, service_id: 1, price: 1 },
      };

      const result = await serviceCollection.findOne(query, options);
      res.send(result);

      // POST chackOut data
      app.post("/checkout", async (req, res) => {
        const checkout = req.body;
        console.log(checkout);
        const result = await checkOutCollection.insertOne(checkout);
        res.send(result);
      });
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Doctor is running");
});

app.listen(port, () => {
  console.log(`server is running on the port ${port}`);
});
