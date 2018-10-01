import fastify from 'fastify';

const app = fastify();

app.get('/hello', async (req, res) => {
  return { hello: 'world' };
});

const start = async () => {
  try {
    await app.listen(3000);
    console.log(`🚀  - Server started at port 3000 - 🚀`);
  } catch (err) {
    console.error(err);
    process.exit(1)
  }
}
start();

