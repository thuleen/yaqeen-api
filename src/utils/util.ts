import { format } from "date-fns";
import bcrypt from "bcrypt";

// generate random 7 digits
const ranVerificationCode = () => {
  return Math.floor(1000000 + Math.random() * 9000000);
};
export { ranVerificationCode };

const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd HH-mm-ss");
};
export { formatDate };

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(13);
  const hash = await bcrypt.hashSync(password, salt);
  return hash;
};
export { hashPassword };

const isPasswordMatch = (plainTextPassword: string, hashPassword: string) => {
  return bcrypt.compareSync(plainTextPassword, hashPassword);
};
export { isPasswordMatch };
