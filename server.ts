import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import { fileURLToPath } from "url";
import fastifyStatic from "@fastify/static";
import fastifyFormBody from "@fastify/formbody";
import fastifyMultipart from "@fastify/multipart";
import fastifyView from "@fastify/view";
import handlebars from "handlebars";
import { IncomingMessage, ServerResponse } from "http";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Fastify instance
const app: FastifyInstance = fastify({
  logger: false
});

// Register plugins
app.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
  prefix: "/",
});

app.register(fastifyFormBody);
app.register(fastifyMultipart);

app.register(fastifyView, {
  engine: {
    handlebars: handlebars,
  },
});

// Define routes
app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.view("../src/pages/index.html");
});

// Export the Vercel/Serverless handler
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await app.ready();
  app.server.emit("request", req, res);
}

// If you need CommonJS export (for some environments)
// export { app };