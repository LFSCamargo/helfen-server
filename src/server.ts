import fastify from 'fastify';
import mongoose from 'mongoose';
import { userAdd, userLogin } from './user/UserMethods';

const app = fastify();

app.post('/api/signup', async (req, res) => {
  const { body, headers } = req;
  console.log('Request Headers: ', headers);
  
  const token = await userAdd({ ...body });

  const response = JSON.stringify({
    token,
  })
  res.send(response)
});

app.post('/api/login', async (req) => {
  const { body } = req;

  const token = await userLogin({ ...body });

  return {
    token,
  }
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

