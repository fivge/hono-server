import { UserModel } from "../../schemas/user";

const userMapper = {
	getByName: async (name: string) => {
		const user = await UserModel.findOne({ name });
		return user;
	},
	create: async (user: UserModel) => {
		const userModel = await UserModel.create(user);

		return userModel;
	},
};

export default userMapper;
