import * as z from "zod";

export const LoginRequestDto = z.object({
	name: z.string().max(30),
	password: z.string().min(6).max(30),
});

export type LoginRequestDto = z.infer<typeof LoginRequestDto>;

export const RegisterRequestDto = z.object({
	name: z.string().min(3).max(20),
	password: z.string().min(6).max(30),
});

export type RegisterRequestDto = z.infer<typeof RegisterRequestDto>;
