import fastify from 'fastify';
import graphql from 'fastify-gql';

const app = fastify({ logger: true });
const port = 5000;

const gql_schema = `type Query {
    recipe(id: ID): Recipe
    pid: Int
}

type Recipe {
    id: ID!
    name: String!
    steps: String!
    ingredients: [Ingredient]!
}

type Ingredient {
    id: ID!
    name: String!
    quantity: String!
}
`;

const resolvers = {
  Query: {
    pid: () => process.pid,
    recipe: async (_: any, { id }: { id: number }) => {
      if (id != 42) throw new Error(`Recipe ${id} not found`);
      return {
        id,
        name: 'Chicken Tikka Masala',
        steps: 'Throw it in a pot...',
      };
    },
  },
  Recipe: {
    ingredients: async (obj: { id: number }) => {
      return obj.id != 42
        ? []
        : [
            { id: 1, name: 'Chicken', quantity: '1 lb' },
            { id: 2, name: 'Sauce', quantity: '2 cups' },
          ];
    },
  },
};

app
  .register(graphql, { schema: gql_schema, resolvers, graphiql: true })
  .listen({ port, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`Server listening at ${address}`);
  });

export { app };
