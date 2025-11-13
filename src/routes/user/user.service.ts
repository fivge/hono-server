import { HttpError } from "@common/api";
import { hashids } from "@core/auth/hash";
import jwtService from "@core/auth/jwt";
import { encodePassword, verifyPassword } from "@core/auth/password";
import mongoose from "mongoose";
import { UserModel } from "../../schemas/user";
import { userTransformer } from "./shared/user.transformer";
import type { LoginRequestDto } from "./user.dto";
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

		const passwordHash = await encodePassword(password);

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
	login: async (params: LoginRequestDto) => {
		const { name, password } = params;

		const user = await userMapper.getByName(name);
		if (!user) {
			throw HttpError({ code: 400, message: "user not found" });
		}

		const isMatch = await verifyPassword(password, user.password);
		if (!isMatch) {
			throw HttpError({ code: 400, message: "invalid password" });
		}

		const token = await jwtService.sign({ id: user.id });

		const publicUser = userTransformer(user);

		return { token, user: publicUser };
	},
};

export default userService;
