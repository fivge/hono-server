import { HttpResponse } from "@common/api";
import { jwtMiddleware } from "@core/middleware/jwt";
import { validator } from "@core/middleware/validator";
import { Hono } from "hono";

import { LoginRequestDto, RegisterRequestDto } from "./user.dto";
import userService from "./user.service";

const user = new Hono();

user.get("/ping", async (c) => {
	return c.text("pong");
});

user.post("/register", validator("json", RegisterRequestDto), async (c) => {
	const params = c.req.valid("json");

	const user = await userService.register(params);

	return c.json(HttpResponse({ message: "user create success", data: user }));
});

user.post("/login", validator("json", LoginRequestDto), async (c) => {
	const params = c.req.valid("json");

	const data = await userService.login(params);

	return c.json(HttpResponse({ message: "login success", data }));
});

user.post("/update", async (c) => {
	// TODO
	return c.text("pong");
});

user.get("/me", jwtMiddleware, async (c) => {
	const payload = c.get("jwtPayload");
	const user = await userService.getMe(payload);
	return c.json(HttpResponse({ data: user }));
});

export { user };
