import { UserModel } from "@schemas/user";

const userMapper = {
	find: async (query: any, opt: any) => {
		const users = await UserModel.find(query, {}, opt);
		return users;
	},
	getById: async (id: string) => {
		const user = await UserModel.findOne({ id });
		return user;
	},
	getByName: async (name: string) => {
		const userModel = await UserModel.findOne({ name });
		return userModel;
	},
	create: async (user: UserModel) => {
		const userModel = await UserModel.create(user);

		return userModel;
	},
};

export default userMapper;
