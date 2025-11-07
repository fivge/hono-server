import mongoose from "mongoose";

const schema = new mongoose.Schema({
	id: { type: String, required: true, unique: true },
	name: { type: String, required: true, unique: true },
	head_img: String,
	password: { type: String, required: true },
	create_at: {
		type: Date,
		default: Date.now,
	},
});

// schema.index({ name: 1 }, { unique: true });

export type UserModel = mongoose.InferSchemaType<typeof schema>;
export const UserModel = mongoose.model("User", schema);
