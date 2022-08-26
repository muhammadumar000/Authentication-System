const fastify = require("fastify")();
fastify.register(require("@fastify/cors"));

fastify.register(require("@fastify/cookie"));

const PORT = process.env.PORT || 3500;

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


fastify.get("/", async (req, res) => {
  res.status(200);
  res.send({ hello: "world" });
});


fastify.listen({ port: PORT }, (err, address) => {
  console.log(`server listening on ${address}`);
});

