import cluster from "cluster";
import os from "os";
import serve from "./server.js";
import "dotenv/config";

const threadsN = os.availableParallelism();

if (cluster.isPrimary) {
    for (let i = 0; i < threadsN; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`child ${worker.process.pid} died`);
    });
} else {
    serve(process.env.WORKER_SERVER_PORT, process.pid);
}
