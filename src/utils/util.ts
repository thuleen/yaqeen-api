import { format, parseISO } from "date-fns";
import bcrypt from "bcrypt";
import crypto from "crypto";

// generate random 7 digits
const ranVerificationCode = () => {
  return Math.floor(1000000 + Math.random() * 9000000);
};
export { ranVerificationCode };

const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd HH-mm-ss");
};
export { formatDate };

const parseStrToDate = (date: string) => {
  return parseISO(date);
};
export { parseStrToDate };

const ranPassword = () => {
  var wishlist =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var length = 8;
  var password = "";
  password = Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join("");

  return password;
};
export { ranPassword };

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
