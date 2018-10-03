import jwt from 'jsonwebtoken';
import { User, JWT_SECRET } from './UserMethods';
import UserModel from './UserModel';

interface JWT {
  id: string,
  iat: number,
}

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
}