import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export const HttpResponse = <T>({
	data,
	message,
}: {
	data: T;
	message?: string;
}) => ({
	success: true,
	data,
	message,
});

export const HttpError = <T>({
	code,
	message,
	errors,
}: {
	code?: ContentfulStatusCode;
	message?: string;
	errors?: T;
}) => {
	const errorResponse = new Response(
		JSON.stringify({ success: false, data: null, message, errors }),
	);

	return new HTTPException(code ?? 400, {
		res: errorResponse,
		// cause,
		// message,
	});
};
