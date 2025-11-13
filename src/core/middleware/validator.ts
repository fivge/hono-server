import { HttpError } from "@common/api";
import { zValidator as zv } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodType } from "zod";

export const validator = <
	T extends ZodType,
	Target extends keyof ValidationTargets,
>(
	target: Target,
	schema: T,
) =>
	zv(target, schema, (result) => {
		if (!result.success) {
			throw HttpError({
				code: 400,
				message: "validation error",
				errors: JSON.parse(result.error.message),
			});
		}
	});
