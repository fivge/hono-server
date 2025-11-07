import { Hono } from "hono";

import { user } from "./user";

const routes = new Hono().basePath("/api");

routes.route("/user", user);

export { routes };
