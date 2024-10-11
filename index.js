const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
const port = process.env.PORT || 5000;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

//middlewares:
app.use(cors());
app.use(express.json());

const uri =
    `mongodb+srv://${dbUser}:${dbPass}@cluster0.1pple.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );

        const userCollection = client.db("hotelDB").collection("users");
        const eventsCollection = client.db("hotelDB").collection("events")


        // GET route
        app.get("/users", async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result)
        });
        app.get("/events", async (req, res) => {
            const result = await eventsCollection.find().toArray();
            res.send(result);
        });
        app.get("/events/:id", async(req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await eventsCollection.findOne(filter);
            res.send(result);
        })

        // POST route 
        app.post("/users", async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        });
        app.post("/events", async (req, res) => {
            const eventDetails = req.body;
            const result = await eventsCollection.insertOne(eventDetails);
            res.send(result);
        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("server is running");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
