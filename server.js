const fastify = require("fastify")();

require('dotenv').config();
const {MongoClient} = require("mongodb");

const uri = process.env.URI_MONGO_DB
const client = new MongoClient(uri)
fastify.register(require("@fastify/cors"));



fastify.register(require("@fastify/cookie")); 

fastify.register(require("@fastify/swagger"), {
  exposeRoute: true,
  routePrefix: "/docs",
  swagger: {
    info: { title: "Login/Signup Api", description: "Login/Signup Api" },
  },
});

fastify.register(require("./routes/authRoute"));
fastify.register(require("./routes/registerRoute"));
fastify.register(require("./routes/loginRoute"));
fastify.register(require('./routes/confirmationRoute'));
fastify.register(require('./routes/forgetPass'));
fastify.register(require('./routes/logoutRoute'));


fastify.get("/", async (req, res) => {
  res.status(200);
  res.send({ hello: "world" });
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


fastify.listen({ port: process.env.PORT || 3500,host:'0.0.0.0'}, (err, address) => {
  console.log(`server listening on ${address}`);
});

