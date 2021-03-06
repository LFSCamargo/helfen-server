import { addLostPet, getLostPets, getMyPets, markPetAsFound } from './pet/PetMethods';
import fastify from 'fastify';
import mongoose from 'mongoose';
import { userAdd, userLogin, addUserPhoto, getUserById } from './user/UserMethods';
import { getUserFromJWT } from './user/auth';

const app = fastify();

app.post('/api/user', async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;

  const auth = await getUserFromJWT(authorization);

  if (!auth) {
    throw new Error('Não Autenticado');
  }

  const user = await getUserById({ ...body });

  const response = JSON.stringify({
    _id: user._id,
    active: user.active,
    name: user.name,
    email: user.email,
    cell: user.cell,
    document: user.document,
    photo: user.photoURI,
  });

  res.send(response);
});

app.post('/api/me', async (req, res) => {
  const { authorization } = req.headers;

  const user = await getUserFromJWT(authorization);

  if (!user) {
    throw new Error('Não Autenticado');
  }

  const response = JSON.stringify({
    _id: user._id,
    active: user.active,
    name: user.name,
    email: user.email,
    cell: user.cell,
    document: user.document,
    photo: user.photoURI,
  });

  res.send(response);
});

app.post('/api/signup', async (req, res) => {
  const { body } = req;

  const token = await userAdd({ ...body });

  const response = JSON.stringify({
    token,
  });

  res.send(response);
});

app.post('/api/login', async (req, res) => {
  const { body } = req;

  const token = await userLogin({ ...body });

  const response = JSON.stringify({
    token,
  });

  res.send(response);
});

app.post('/api/getMyPets', async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;

  const user = await getUserFromJWT(authorization);

  if (!user) {
    throw new Error('Não Autenticado');
  }

  const pets = await getMyPets({ userId: user._id, limit: body.limit, offset: body.offset });

  const response = JSON.stringify({
    pets,
  });

  res.send(response);
});

app.post('/api/getLostPets', async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;

  const user = await getUserFromJWT(authorization);

  if (!user) {
    throw new Error('Não Autenticado');
  }

  const pets = await getLostPets({ ...body, user });

  const response = JSON.stringify({
    pets,
  });

  res.send(response);
});

app.post('/api/markAsFound', async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;

  const user = await getUserFromJWT(authorization);

  if (!user) {
    throw new Error('Não Autenticado');
  }

  const message = await markPetAsFound({ ...body });

  const response = JSON.stringify({
    message,
  });

  res.send(response);
});

app.post('/api/addPet', async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;

  const user = await getUserFromJWT(authorization);

  if (!user) {
    throw new Error('Não Autenticado');
  }

  const pet = await addLostPet({ ...body, user });

  const response = JSON.stringify({
    pet,
    message: 'Pet added with success',
  });

  res.send(response);
});

app.post('/api/user/addPhoto', async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;

  const user = await getUserFromJWT(authorization);

  if (!user) {
    throw new Error('Não Autenticado');
  }

  const message = await addUserPhoto({ ...body, _id: user._id });

  const response = JSON.stringify({
    message,
    status: 200,
  });

  res.send(response);
});

const start = async () => {
  try {
    mongoose.connect('mongodb://root:unibta2018A@ds018558.mlab.com:18558/unibtapet');
    console.log('Connected to mongo ✅');
    await app.listen(3000);
    console.log(`🚀  - Server started at port 3000 - 🚀`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
start();
