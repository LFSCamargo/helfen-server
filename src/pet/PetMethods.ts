import fetch from 'node-fetch';
import queryString from 'query-string';
import { Document } from 'mongoose';
import PetModel from './PetModel';
import { User } from '../user/UserMethods';
import { GeoLocation } from './GeolocationTypes';

export interface Pet extends Document {
  _id: string;
  name: string;
  address: string;
  geocode: Array<string>;
  type: string;
  obs: string;
  photo: string;
  user: string;
  active: boolean;
}

interface AddLostPet {
  name: string;
  address: string;
  type: string;
  obs: string;
  photo: string;
  user: User;
}

export const addLostPet = async ({
  name,
  address,
  type,
  obs,
  photo,
  user,
}: AddLostPet): Promise<Pet> => {
  const params = {
    searchtext: address,
    app_id: 'bLs9c4uTcmNN9iY5F4VD',
    app_code: 'JpTEmxxROt3t1V87G8Q6mw',
    gen: 8,
  };

  const parsed = queryString.stringify(params);

  const uri = `https://geocoder.api.here.com/6.2/geocode.json?${parsed}`;

  console.log('URI', uri);

  const response = await fetch(uri);
  const data: GeoLocation = await response.json();

  const { View } = data.Response;

  if (View.length === 0) {
    throw new Error('Endereço Invalido');
  }

  const { Result } = View[0];

  const { DisplayPosition } = Result[0].Location;
  console.log('DisplayPosition', JSON.stringify(DisplayPosition));

  const pet = new PetModel({
    name,
    address,
    location: {
      coordinates: [DisplayPosition.Latitude, DisplayPosition.Longitude]
    },
    type,
    obs,
    photo,
    user: user._id,
  });

  await pet.save();

  const { _id } = pet;

  return await PetModel.findOne({ _id });
};

interface GetLostPets {
  search: string;
  limit: number;
  offset: number;
  user: User;
}

export const getLostPets = async ({ search, user }: GetLostPets): Promise<Array<Pet>> => {
  const where = search ? {
    name: {
      $regex: new RegExp(`^${search}^`, 'ig'),
    },
    active: true,
    user: { $ne: user._id.toString() },
  } : {
    active: true,
    user: { $ne: user._id },
  };

  const pets = await PetModel.find(where);

  return pets;
};

interface GetMyPets {
  userId: string;
  limit: number;
  offset: number;
}

export const getMyPets = async ({ userId, limit, offset }: GetMyPets): Promise<Array<Pet>> =>
  !offset
    ? await PetModel.find({ user: userId, active: true }).limit(limit)
    : await PetModel.find({ user: userId, active: true }).skip(offset).limit(limit);

interface MarkAsFound {
  _id: string;
}

export const markPetAsFound = async ({ _id }: MarkAsFound): Promise<string> => {
  const pet = await PetModel.findOne({ _id });

  if (!pet) {
    throw new Error('Animal Não Encontrado');
  }

  await pet.update({ active: false });

  return 'Pet Marcado Como Encontrado';
};

