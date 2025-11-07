import type { Context, Next } from "hono";
import { jwt } from "hono/jwt";

export const jwtMiddleware = (c: Context, next: Next) =>
	jwt({
		secret: process.env.JWT_SECRET,
	})(c, next);
