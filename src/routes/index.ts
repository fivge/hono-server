import { Hono } from "hono";

const routes = new Hono().basePath("/api");

export { routes };
