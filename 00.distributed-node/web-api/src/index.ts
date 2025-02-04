import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import HttpRetry from "./HttpRetry.js";
import middie from "middie";
import Logger from "./logstash.js";

// const app: FastifyInstance = fastify({ logger: true });
const app: FastifyInstance = fastify();

(async () => {
    await app.register(middie);

    app.use((req: FastifyRequest, reply: FastifyReply, next: (err?: Error) => void) => {
        req.url !== "/health" &&
            Logger.logInfo("request-icomming", {
                path: req.url,
                method: req.method,
                ip: req.ip,
                ua: req.headers["user-agent"] || null,
            });
        next();
    });
    app.setErrorHandler(async (error, req) => {
        Logger.logError("reuest-failure", {
            stack: error.stack,
            path: req.url,
            method: req.method,
        });
        return { error: error.message };
    });

    app.get("/", async (req, reply) => {
        try {
            const url = "http://recipe-api:5000/recipes/42";
            const res = await HttpRetry.fetch(url);
            Logger.logInfo("request-outgoing", {
                url,
                svc: "recipe-api",
            });

            if (res.status === "DONE") {
                return {
                    consumer_pid: process.pid,
                    producer_data: res.response,
                    status: "success",
                };
            } else {
                // console.info({ res });
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

    app.get("/health", async (req, reply) => {
        // console.log("Health check");
        return "Ok";
    });

    app.get("/error", async () => {
        throw new Error("ERROR !!");
    });

    app.listen({ port: Number(process.env.PORT || 3001), host: "0.0.0.0" }, (err, address) => {
        app.log.info(`server listening on ${address}`);
    });
})();

export { app };
