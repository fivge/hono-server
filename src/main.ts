import app from "./app";
import { connect, disconnect } from "./mongo";

const PORT = process.env.PORT || 3000;

const main = async () => {
	await connect();

	const server = Bun.serve({
		fetch: app.fetch,
		port: PORT,
	});

	const shutdown = async () => {
		try {
			await disconnect();
		} catch {}

		server.stop();
		process.exit(0);
	};

	process.once("SIGINT", () => shutdown());
	process.once("SIGTERM", () => shutdown());

	console.log(`Server running on http://localhost:${PORT}`);
};

main();
