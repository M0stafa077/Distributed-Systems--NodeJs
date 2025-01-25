import Fastify from "fastify";
const app = Fastify();

export default function serve(port, pid) {
    app.get("/", async (req, res) => {
        res.send({
            message: "Hello world",
            serverPort: port,
            pid,
        });
    });

    app.listen({ port }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server listening at ${address} and pid ${pid}`);
    });
}
