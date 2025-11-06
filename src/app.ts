import { Hono } from "hono";
import { routes } from "./routes";

const app = new Hono({ strict: false });

app.route("/", routes);

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

export default app;
