import mongoose from "mongoose";
import { hashids } from "../../core/auth/hash";
import jwt from "../../core/auth/jwt";
import { UserModel } from "../../schemas/user";
import { userTransformer } from "./shared/user.transformer";
import userMapper from "./user.mapper";

const userService = {
	find: async (query: any, opt: any) => {
		const users = await UserModel.find(query, {}, opt);
		return users;
	},
	getById: async (id: string) => {
		const user = await UserModel.findOne({ id });
		const publicUser = userTransformer(user);
		return publicUser;
	},
	getByName: async (name: string) => {
		const user = await UserModel.findOne({ name });
		const publicUser = userTransformer(user);
		return publicUser;
	},
	create: async (params: any) => {
		const { name, password } = params;

		const passwordHash = await Bun.password.hash(password);

		const uid = new mongoose.Types.ObjectId();
		const id = hashids.encodeHex(uid.toString());

		const create_at = new Date();

		const user = {
			_id: uid,
			id,
			name,
			password: passwordHash,
			head_img: "",
			create_at,
		};

		const userModel = await userMapper.create(user);
		const publicUser = userTransformer(userModel);

		return publicUser;
	},
	update: async (user: any) => {
		// TODO
		// const updatedUser = await UserModel.update(
		// 	{
		// 		_id: user.id,
		// 	},
		// 	{
		// 		$set: {
		// 			nick_name: user.nick_name,
		// 			head_img: user.head_img,
		// 			password: user.password,
		// 		},
		// 	},
		// );
		// return updatedUser;
	},
	delete: async (id: string) => {
		// const deletedUser = await UserModel.deleteOne({ _id: id });
		// return deletedUser;
	},
	verifyPassword: async (password: string, passwordHash: string) => {
		const isMatch = await Bun.password.verify(password, passwordHash);
		return isMatch;
	},
	login: async (params: any) => {
		const { name, password } = params;

		const user = await userMapper.getByName(name);
		if (!user) {
			throw new Error("User not found");
		}

		const isMatch = await userService.verifyPassword(password, user.password);
		if (!isMatch) {
			throw new Error("Invalid password");
		}

		// TODO generate token
		// const token = "xxx";
		const token = await jwt.sign({ id: user.id });

		console.log("********* userInfo", user, token);

		// TODO filter user info
		// * or get user info in another api when login success, to recheck token
		const publicUser = userTransformer(user);

		return { token, user: publicUser };
	},
};

export default userService;
