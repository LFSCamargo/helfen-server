import { addLostPet } from './pet/PetMethods';
import fastify from 'fastify';
import mongoose from 'mongoose';
import { userAdd, userLogin } from './user/UserMethods';
import { getUserFromJWT } from './user/auth';

const app = fastify();

app.post('/api/signup', async (req, res) => {
  const { body } = req;
  
  const token = await userAdd({ ...body });

  const response = JSON.stringify({
    token,
  })
  
  res.send(response)
});

app.post('/api/login', async (req, res) => {
  const { body } = req;

  const token = await userLogin({ ...body });

  const response = JSON.stringify({
    token,
  })

  res.send(response)
});

app.post('/api/addPet', async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;

  const user = await getUserFromJWT(authorization);
  
  if (!user) {
    throw new Error('Unauthenticated'); 
  }

  const pet = await addLostPet({ ...body, user })

  const response = JSON.stringify({
    pet,
    message: 'Pet added with success',
  });

  res.send(response);
})

const start = async () => {
  try {
    mongoose.connect('mongodb://localhost/node-ibta');
    console.log('Connected to mongo ✅');
    await app.listen(3000);
    console.log(`🚀  - Server started at port 3000 - 🚀`);
  } catch (err) {
    console.error(err);
    process.exit(1)
  }
}
start();

