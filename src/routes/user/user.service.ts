import { HttpError } from "@common/api";
import { hashids } from "@core/auth/hash";
import jwtService, { type IJwtPayload } from "@core/auth/jwt";
import { encodePassword, verifyPassword } from "@core/auth/password";
import mongoose from "mongoose";

import { userTransformer } from "./shared/user.transformer";
import type { LoginRequestDto, RegisterRequestDto } from "./user.dto";
import userMapper from "./user.mapper";

const userService = {
	_create: async (params: RegisterRequestDto) => {
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

		return userModel;
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

		const token = await jwtService.sign({ id: user.id, role: "user" });

		const publicUser = userTransformer(user);

		return { token, user: publicUser };
	},
	register: async (params: RegisterRequestDto) => {
		const { name } = params;

		const userExists = await userMapper.getByName(name);
		if (userExists) {
			throw HttpError({ code: 400, message: "user already exists" });
		}

		const userModel = await userService._create(params);
		// TODO create project
		// const project = await projectService.create({ user: newUser.id,name, password: newPassword });
		// TODO create mock

		const publicUser = userTransformer(userModel);

		return publicUser;
	},
	getMe: async (payload: IJwtPayload) => {
		const user = await userMapper.getById(payload.sub);
		if (!user) {
			throw HttpError({ code: 400, message: "user not found" });
		}
		const publicUser = userTransformer(user);
		return publicUser;
	},
};

export default userService;
