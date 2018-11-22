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
  photoURI: string;
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
    throw new Error('Usuário não encontrado');
  }

  const { password: passwordHash } = user;

  const isPasswordValid = authenticate(password, passwordHash);

  if (!isPasswordValid) {
    throw new Error('Usuário ou Senha Inválidos');
  }

  return generateToken(email);
};

export const addUserPhoto = async ({ photoURI, _id }): Promise<string> => {
  const user = await UserModel.findOne({ _id });

  await user.update({
    photoURI,
  });

  return 'Foto alterada com sucesso!';
};

export const getUserById = async ({ _id }): Promise<User> => await UserModel.findOne({ _id });