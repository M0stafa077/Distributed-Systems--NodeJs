import fastify from "fastify";
import fetch from "node-fetch";

const app = fastify({ logger: true });

app.get("/", async (req, reply) => {
    try {
        const res = await fetch("http://recipe-api:5000/recipes/42");
        const producer_data = await res.json();
        return {
            consumer_pid: process.pid,
            producer_data,
            status: "success",
        };
    } catch (err: any) {
        reply.status(500);
        return {
            consumer_pid: process.pid,
            error: err.message,
            status: "failed",
        };
    }
});

app.listen({ port: 3001, host: "0.0.0.0" }, (err, address) => {
    app.log.info(`server listening on ${address}`);
});

export { app };
