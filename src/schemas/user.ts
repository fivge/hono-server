import mongoose from "mongoose";

const schema = new mongoose.Schema({
	name: String,
	nick_name: String,
	head_img: String,
	password: String,
	create_at: {
		type: Date,
		default: Date.now,
	},
});

schema.index({ name: 1 }, { unique: true });

export type UserModel = mongoose.InferSchemaType<typeof schema>;
export const UserModel = mongoose.model("User", schema);
