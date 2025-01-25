import { Worker, isMainThread } from "node:worker_threads";
import "dotenv/config";

if (isMainThread) {
    serve(process.env.MAIN_SERVER_PORT);
    const worker = new Worker("./worker_threads_module.js");
} else {
    serve(process.env.WORKER_SERVER_PORT);
}
