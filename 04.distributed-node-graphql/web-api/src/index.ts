import fastify, { FastifyInstance } from "fastify";
import fetch from "node-fetch";

const app: FastifyInstance = fastify({ logger: true });

const query = `query kitchenSink ($id: ID) {
    recipe(id: $id) {
        id
        name
        ingredients {
            name quantity
        }
    }
    pid
}`;

app.get("/", async (request, reply) => {
    const result = await fetch("http://recipe-api:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query,
            variables: { id: "42" },
        }),
    });

    return {
        pid: process.pid,
        producer_data: await result.json(),
    };
});

app.listen({ port: 3001, host: "0.0.0.0" }, (err, address) => {
    app.log.info(`server listening on ${address}`);
});

export { app };
