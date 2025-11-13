import * as z from "zod";

export const LoginRequestDto = z.object({
	name: z.string(),
	password: z.string(),
});

export type LoginRequestDto = z.infer<typeof LoginRequestDto>;
