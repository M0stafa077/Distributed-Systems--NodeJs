import util from "util";
import grpc from "@grpc/grpc-js";
import fastify from "fastify";
import loader from "@grpc/proto-loader";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = fastify();
const pkg_def = loader.loadSync(__dirname + "/../../shared/grpc-recipe.proto");

const host = "0.0.0.0";
const port = process.env.PORT || 3000;
const TARGET = "recipe-api:5000";

const recipePackage = grpc.loadPackageDefinition(pkg_def) as any;
const recipe = recipePackage.recipe;
const client = new recipe.RecipeService(TARGET, grpc.credentials.createInsecure());
const getMetaData = util.promisify(client.getMetaData.bind(client));
const getRecipe = util.promisify(client.getRecipe.bind(client));

server.get("/", async () => {
    const [meta, recipe] = await Promise.all([getMetaData({}), getRecipe({ id: 42 })]);
    return {
        consumer_pid: process.pid,
        producer_data: meta,
        recipe,
    };
});

server.listen({ port: +port, host }, () => {
    console.log(`Consumer running at http://${host}:${port}/`);
});
