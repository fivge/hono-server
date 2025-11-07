import { UserModel } from "../../schemas/user";

const userService = {
	find: async (query: any, opt: any) => {
		const users = await UserModel.find(query, {}, opt);
		return users;
	},
	getById: async (id: string) => {
		const user = await UserModel.findById(id);
		return user;
	},
	getByName: async (name: string) => {
		const user = await UserModel.findOne({ name });
		return user;
	},
	create: async (user: any) => {
		const newUser = new UserModel();
		newUser.name = user.name;
		newUser.password = user.password;
		newUser.nick_name = user.nick_name || Date.now();
		newUser.head_img = user.head_img;
		await newUser.save();

		return newUser;
		// await UserModel.create(user);
		// return newUser;
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
};

export default userService;
