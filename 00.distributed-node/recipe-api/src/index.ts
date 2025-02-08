import fastify from 'fastify';

const app = fastify({ logger: true });
const port = process.env.PORT || 5000;

app.get('/', async (request, reply) => {
  reply.send('hello world');
});

app.get('/recipes/:id', async (request, reply) => {
  console.log(`worker request pid: ${process.pid}`);

  const { id } = request.params as { id: string };

  if (+id !== 42) {
    reply.status(404).send({ error: 'Not Found' });
    return;
  }
  reply.send({
    producer_pid: process.pid,
    recipe: {
      id: Number(id),
      name: 'Chicken Tikka Masala',
      steps: 'Throw it in a pot...',
      ingredients: [
        { id: 1, name: 'Chicken', quantity: '1 lb' },
        { id: 2, name: 'Sauce', quantity: '2 cups' },
      ],
    },
  });
});

app.listen({ port: +port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});

export { app };
