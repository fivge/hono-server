import { sign, verify } from "hono/jwt";

const jwtService = {
	sign: async (params: any) => {
		const payload = {
			sub: params.id,
			role: "user",
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
