declare module "bun" {
	interface Env {
		MONGO_DB_URL: string;
		JWT_SECRET: string;
	}
}
