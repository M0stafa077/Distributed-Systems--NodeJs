import fastify from "fastify";
import HttpRetry from "./HttpRetry";

const app = fastify({ logger: true });

app.get("/", async (req, reply) => {
    try {
        const res = await HttpRetry.fetch("http://recipe-api:5000/recipes/42");

        if (res.status === "DONE") {
            return {
                consumer_pid: process.pid,
                producer_data: res.response,
                status: "success",
            };
        } else {
            reply.status(res.code);
            return {
                consumer_pid: process.pid,
                error: "Failed to fetch data from producer",
                status: "failed",
            };
        }
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
