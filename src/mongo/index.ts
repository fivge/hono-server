import mongoose from "mongoose";

const MONGO_DB_URL = process.env.MONGO_DB_URL;

export async function connect() {
	await mongoose.connect(MONGO_DB_URL, { autoIndex: false });
	console.log("connected to mongo success");
}

export async function disconnect() {
	await mongoose.disconnect();
	console.log("disconnected from mongo success");
}
