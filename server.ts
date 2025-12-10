import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import { fileURLToPath } from "url";
import fastifyStatic from "@fastify/static";
import fs from "fs/promises";
import { IncomingMessage, ServerResponse } from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: FastifyInstance = fastify({
  logger: true
});

app.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
  prefix: "/",
});

app.register(fastifyStatic, {
  root: path.join(__dirname, "src/pages"),
  prefix: "/pages/",
  decorateReply: false,
});

app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const htmlContent = await fs.readFile(
      path.join(__dirname, "src/pages", "index.html"),
      "utf-8"
    );
    reply.type("text/html").send(htmlContent);
  } catch (error) {
    reply.code(404).send("Page not found");
  }
});

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await app.ready();
  app.server.emit("request", req, res);
}
