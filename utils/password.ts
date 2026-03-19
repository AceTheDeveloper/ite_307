import bcrypt from "bcrypt";

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function decodePassword(
  password: string,
  hashedPassword: string,
): Promise<string> {
  return bcrypt.compare(password, hashedPassword);
}
