import { Hono } from "hono";
import { PAGE_INDEX, PAGE_SIZE } from "../../common/consts";
import userService from "./user.service";

const user = new Hono();

user
	.get("/ping", async (c) => {
		return c.text("pong");
	})
	// /users
	.get("/", async (c) => {
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
	.post("/login", async (c) => {
		const params = await c.req.json();
		const { name, password } = params;

		// TODO validate
		if (!name || !password) {
			return c.json({ error: "Name and password are required" }, 400);
		}

		const user = await userService.getByName(name);
		if (!user) {
			return c.json({ error: "User not found" }, 404);
		}

		// TODO verify password
		if (user.password !== password) {
			return c.json({ error: "Invalid password" }, 401);
		}

		// TODO generate token
		// const token = jwt.sign({ id: user.id }, jwtSecret, {
		// 	expiresIn: jwtExpire,
		// });

		return c.json({ message: "Login successful", token: "xxx" });
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

			const user = await userService.getByName(name);
			if (user) {
				return c.json({ error: "User already exists" }, 400);
			}

			// TODO hash
			const newPassword = password;
			const newUser = await userService.create({ name, password: newPassword });
			// TODO create project
			// const project = await projectService.create({ user: newUser.id,name, password: newPassword });
			// TODO create mock

			return c.json({ message: "User created successfully" });
		} catch (error: any) {
			console.error(error);
			return c.json({ error: error?.message ?? "Internal Server Error" }, 500);
		}
	});

export { user };
