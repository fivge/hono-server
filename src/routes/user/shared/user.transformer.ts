import type { UserModel } from "../../../schemas/user";

export const userTransformer = (user: UserModel | null) => {
	if (!user) {
		return null;
	}
	return {
		id: user.id,
		name: user.name,
		headImg: user.head_img,
		createAt: user.create_at,
	};
};
