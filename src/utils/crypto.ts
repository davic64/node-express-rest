import bcrypt from "bcryptjs";

const saltRounds = 10;

const encryptPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

const verifyPassword = async (password: string, hash: string) => {
  const result = await bcrypt.compare(password, hash);
  return result;
};

export { encryptPassword, verifyPassword };
