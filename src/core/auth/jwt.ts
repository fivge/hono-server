import { sign, verify } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";

export interface IJwtPayload extends JWTPayload {
	sub: string;
	role: "user" | "admin";
	exp: number;
}

interface SignParams {
	id: string;
	role: "user" | "admin";
}

const jwtService = {
	sign: async (params: SignParams) => {
		const payload: IJwtPayload = {
			sub: params.id,
			role: params.role,
			exp: Math.floor(Date.now() / 1000) + 60 * 30, // Token expires in 5 minutes
		};

		const secret = process.env.JWT_SECRET;
		if (!secret) {
			throw new Error("JWT_SECRET is not set");
		}

		const token = await sign(payload, secret);
		return token;
	},
	verify: async (token: string) => {
		const secret = process.env.JWT_SECRET;
		if (!secret) {
			throw new Error("JWT_SECRET is not set");
		}
		const payload = await verify(token, secret);
		return payload;
	},
};

export default jwtService;
