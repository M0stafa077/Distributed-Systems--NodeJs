import fastify from "fastify";

const server = fastify({ logger: true });

const user_pojo = {
    username: "user-pojo-username",
    email: "user-pojo-email",
};

// marshalling the user_pojo object to JSON
class User {
    username;
    email;
    constructor(username, email) {
        this.username = username;
        this.email = email;
    }

    toJSON() {
        return {
            username: this.username,
            email: this.email,
        };
    }
}
const user_class = new User("user-class-username", "user-class-email");

server.get("/", async (request, reply) => {
    return { hello: "world" };
});

server.get("/user-info", async (request, reply) => {
    return {
        user_pojo,
        user_class,
    };
});

server.get("/user-info-password", async (request, reply) => {
    user_pojo.password = "user-pojo-password";
    user_class.password = "user-class-password";

    return {
        user_pojo, // returns the password
        user_class, // does not return the password
    };
});

server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    server.log.info(`server listening on ${address}`);
});
