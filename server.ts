const fastify = require("fastify")({
  logger: false
});

const path = require("path");

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "../public"),
  prefix: "/",
});

fastify.register(require("@fastify/formbody"));
fastify.register(require("@fastify/multipart"));

fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

fastify.get("/", (request, reply) => {
  return reply.view("../src/pages/index.html");
});

module.exports = async (req, res) => {
  await fastify.ready();
  fastify.server.emit("request", req, res);
};
