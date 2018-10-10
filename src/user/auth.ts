import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, JWT_SECRET } from './UserMethods';
import UserModel from './UserModel';

interface JWT {
  id: string;
  iat: number;
}

export const encryptPassword = (password: string): string => bcrypt.hashSync(password, 8);

export const authenticate = (plainTextPassword: string, hash: string): boolean =>
  bcrypt.compareSync(plainTextPassword, hash);

export const generateToken = (email: string): string =>
  `JWT ${jwt.sign({ id: email }, JWT_SECRET)}`;

export const getUserFromJWT = async (token: string): Promise<User | null> => {
  if (!token) {
    return null;
  }

  try {
    const userEmail: any = jwt.verify(token.substring(4), JWT_SECRET);

    console.log(userEmail);

    return await UserModel.findOne({ email: userEmail.id });
  } catch (e) {
    return null;
  }
};
