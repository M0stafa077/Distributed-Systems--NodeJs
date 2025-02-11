import * as grpc from '@grpc/grpc-js';
import * as loader from '@grpc/proto-loader';
import { pid } from 'process';
import { RecipeServiceHandlers } from './types';

const port = process.env.PORT || 5000;
const host = '0.0.0.0';

const pkg_def = loader.loadSync(__dirname + '/../../shared/grpc-recipe.proto');
const recipe = (grpc.loadPackageDefinition(pkg_def) as any).recipe;

const server = new grpc.Server();

server.addService(recipe.RecipeService.service, {
  getMetaData: (_call, cb) => {
    cb(null, { pid });
  },
  getRecipe: (call, cb) => {
    if (call.request.id !== 42) {
      return cb(new Error(`unknown recipe ${call.request.id}`));
    }
    cb(null, {
      id: 42,
      name: 'Chicken Tikka Masala',
      steps: 'Throw it in a pot...',
      ingredients: [
        { id: 1, name: 'Chicken', quantity: '1 lb' },
        { id: 2, name: 'Sauce', quantity: '2 cups' },
      ],
    });
  },
} as RecipeServiceHandlers);

server.bindAsync(
  `${host}:${port}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) throw err;
    // server.start();
    console.log(`Producer running at http://${host}:${port}/`);
  }
);
