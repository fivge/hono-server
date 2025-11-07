import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { PAGE_INDEX, PAGE_SIZE } from "../../common/consts";
import { jwtMiddleware } from "../../core/middleware/jwt";
import userService from "./user.service";

const user = new Hono();

user
	.get("/ping", async (c) => {
		return c.text("pong");
	})
	// /users
	.get("/", jwtMiddleware, async (c) => {
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
	})
	.get("/me", jwtMiddleware, async (c) => {
		try {
			const payload = c.get("jwtPayload");
			const user = await userService.getById(payload.sub);
			// TODO filter user info
			return c.json(user);
		} catch (error) {
			return c.json({ error: error?.message ?? "Internal Server Error" }, 500);
		}
	})
	.post("/login", async (c) => {
		try {
			const params = await c.req.json();
			const { name, password } = params;

			// TODO validate
			if (!name || !password) {
				return c.json({ error: "Name and password are required" }, 400);
			}

			const tokens = await userService.login({ name, password });

			return c.json({ code: 0, message: "Login successful", data: tokens });
		} catch (error: any) {
			return c.json({ error: error?.message ?? "Internal Server Error" }, 500);
		}
	})
	// /:id
	.post("/update", async (c) => {
		// TODO
		return c.text("pong");
	})
	.post("/register", async (c) => {
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
