import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import { fileURLToPath } from "url";
import fastifyStatic from "@fastify/static";
import fs from "fs/promises";

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

app.get("/simple", async (request: FastifyRequest, reply: FastifyReply) => {
  reply.redirect("/pages/index.html");
});
