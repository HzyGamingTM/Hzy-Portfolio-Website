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
  logger: true  // Enable logging to see errors
});

// Register plugins
app.register(fastifyStatic, {
  root: path.join(__dirname, "public"),  // Adjusted path
  prefix: "/",
});

app.register(fastifyFormBody);
app.register(fastifyMultipart);

// Configure view engine with absolute path
app.register(fastifyView, {
  engine: {
    handlebars: handlebars,
  },
  root: path.join(__dirname, "src/pages"),  // Set the root directory for templates
  viewExt: "html",  // Tell Fastify to treat .html as handlebars files
});

// Define routes
app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
  // Now just use the filename since root is set
  return reply.view("index.html");
});

// Add error handler for debugging
app.setErrorHandler((error, request, reply) => {
  console.error("Fastify Error:", error);
  reply.status(500).send({ 
    error: "Internal Server Error",
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined
  });
});

// Export the Vercel/Serverless handler
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await app.ready();
  app.server.emit("request", req, res);
}