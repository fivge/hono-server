import { HttpResponse } from "@common/api";
import { PAGE_INDEX, PAGE_SIZE } from "@common/consts";
import { jwtMiddleware } from "@core/middleware/jwt";
import { validator } from "@core/middleware/validator";
import { Hono } from "hono";

import { LoginRequestDto } from "./user.dto";
import userService from "./user.service";

const user = new Hono();

user.get("/ping", async (c) => {
	return c.text("pong");
});

user.get("/users", jwtMiddleware, async (c) => {
	try {
		const pageSize = +(c.req.query("page_size") || PAGE_SIZE);
		const pageIndex = +(c.req.query("page_index") || PAGE_INDEX);
		const keywords = c.req.query("keywords");

		// TODO pagging
		const opt = {
			skip: (pageIndex - 1) * pageSize,
			limit: pageSize,
			sort: "-create_at",
		};

		const where = {
			// _id: {
			// $ne: ctx.state.user.id, // TODO
			// },
		};

		if (keywords) {
			const keyExp = new RegExp(keywords);
			where.$or = [
				{
					name: keyExp,
				},
				{
					nick_name: keyExp,
				},
			];
		}

		const users = await userService.find(where, opt);

		// TODO hide password etc
		return c.json(users);
	} catch (error: any) {
		// TODO error handle
		return c.json({ error: error?.message ?? "Internal Server Error" }, 500);
	}

	// return c.text("pong");
});

user.get("/me", jwtMiddleware, async (c) => {
	try {
		const payload = c.get("jwtPayload");
		const user = await userService.getById(payload.sub);
		// TODO filter user info
		return c.json(user);
	} catch (error) {
		return c.json({ error: error?.message ?? "Internal Server Error" }, 500);
	}
});

user.post("/login", validator("json", LoginRequestDto), async (c) => {
	const params = c.req.valid("json");

	const data = await userService.login(params);

	return c.json(HttpResponse({ message: "login success", data }));
});

// /:id
user.post("/update", async (c) => {
	// TODO
	return c.text("pong");
});

user.post("/register", async (c) => {
	try {
		const params = await c.req.json();
		const { name, password } = params;
		// TODO validate

		const userExists = await userService.getByName(name);
		if (userExists) {
			return c.json({ error: "User already exists" }, 400);
		}

		const user = await userService.create({ name, password });
		// TODO create project
		// const project = await projectService.create({ user: newUser.id,name, password: newPassword });
		// TODO create mock

		// TODO add a common bean
		return c.json({
			code: 0,
			message: "User created successfully",
			data: user,
		});
	} catch (error: any) {
		console.error(error);
		return c.json({ error: error?.message ?? "Internal Server Error" }, 500);
	}
});

export { user };
