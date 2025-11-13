import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { routes } from "./routes";

const app = new Hono({ strict: false });

app.route("/", routes);

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.onError((error) => {
	if (error instanceof HTTPException) {
		return error.getResponse();
	}

	return new Response(
		JSON.stringify({
			success: false,
			message: error.message || "Internal Server Error",
		}),
		{
			status: 500,
		},
	);
});

export default app;
