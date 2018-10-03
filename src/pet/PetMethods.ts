import fetch from 'node-fetch';
import { Document } from 'mongoose';
import PetModel from './PetModel';
import { User } from '../user/UserMethods';

export interface Pet extends Document {
  // _id: string,
  name: string,
  address: string,
  geocode: Array<string>,
  type: string,
  obs: string,
  photo: string,
  user: string,
  // active: boolean,
}

interface AddLostPet {
  name: string,
  address: string,
  type: string,
  obs: string,
  photo: string,
  user: User,
}

export const addLostPet = async ({ name, address, type, obs, photo, user }: AddLostPet): Promise<Pet> => {
  const uri = `http://maps.google.com/maps/api/geocode/json?address=${address}&sensor=false`;
  const response = await fetch(uri);
  const data = await response.json();

  if (data == null || data.status === 'ZERO_RESULTS') {
    throw new Error('Invalid Address');
  }

  const geoLocation: Array<string> = [
    data.results[0].geometry.location.lat.toString(),
    data.results[0].geometry.location.lng.toString(),
  ];

  const newPet = new PetModel({
    name,
    address,
    geocode: geoLocation,
    obs,
    type,
    photo,
    user: user._id,
  })

  await newPet.save();

  const { _id } = newPet;

  return await PetModel.findOne({ _id });
}