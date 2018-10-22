import { generateToken, authenticate, encryptPassword } from './auth';
import { Document } from 'mongoose';
import UserModel from './UserModel';

export const JWT_SECRET = 'node-ibta';

export interface User extends Document {
  _id: string;
  name: string;
  password: string;
  email: string;
  cell: string;
  document: string;
  active: boolean;
}

export interface UserAdd {
  name: string;
  password: string;
  email: string;
  cell: string;
  document: string;
}

export const userAdd = async ({
  name,
  password,
  email,
  cell,
  document,
}: UserAdd): Promise<string> => {
  const hashedPassword = encryptPassword(password);

  const user = new UserModel({
    name,
    password: hashedPassword,
    email,
    cell,
    document,
  });

  await user.save();

  return generateToken(email);
};

interface Login {
  email: string;
  password: string;
}

export const userLogin = async ({ email, password }: Login): Promise<string> => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  const { password: passwordHash } = user;

  const isPasswordValid = authenticate(password, passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid Password');
  }

  return generateToken(email);
};
