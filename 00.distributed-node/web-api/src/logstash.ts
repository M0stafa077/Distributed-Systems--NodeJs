import dgram from "dgram";
import { hostname } from "os";

const client = dgram.createSocket("udp4");
const [LS_HOST, LS_PORT] = process.env.LOGSTASH?.split(":") || ["elk", "7777"];
const NODE_ENV = process.env.NODE_ENV || "development";

export default class Logger {
    constructor() {
        console.error("THIS IS A STATIC CLASS, DO NOT INSTANTIATE OBJECTS");
    }

    static logInfo(type: string, fields: object) {
        this.log("info", type, fields);
    }

    static logError(type: string, fields: object) {
        this.log("error", type, fields);
    }

    private static log(severity: string, type: string, fields: object) {
        const payload = JSON.stringify({
            "@timestamp": new Date().toISOString(),
            "@version": 1,
            app: "web-api",
            environment: NODE_ENV,
            severity,
            type,
            fields,
            hostname: hostname(),
        });

        console.log(payload);
        client.send(payload, Number(LS_PORT), LS_HOST, (err) => {
            if (err) console.error("UDP Log Error:", err);
        });
    }
}
