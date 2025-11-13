export const encodePassword = async (password: string) => {
	const passwordHash = await Bun.password.hash(password);
	return passwordHash;
};

export const verifyPassword = async (
	password: string,
	passwordHash: string,
) => {
	const isMatch = await Bun.password.verify(password, passwordHash);
	return isMatch;
};
