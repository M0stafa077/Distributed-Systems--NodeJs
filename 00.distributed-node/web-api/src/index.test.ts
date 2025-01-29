import { app } from "./index";
import HttpRetry, { HttpRetryResponse } from "./HttpRetry";
import supertest from "supertest";
import TestAgent from "supertest/lib/agent";

let request: TestAgent<supertest.Test>;

describe("Fastify Server Tests", () => {
    let fetchMock: jest.SpyInstance<
        Promise<HttpRetryResponse>,
        [url: string, options?: RequestInit | undefined],
        any
    >;

    beforeAll(async () => {
        // Start the server only once
        await app.listen({ port: 0 }); // Use port 0 to assign a random available port
        request = supertest(app.server);
    });

    afterAll(async () => {
        // Close the server after all tests
        await app.close();
    });

    beforeEach(() => {
        fetchMock = jest.spyOn(HttpRetry, "fetch");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return success when HttpRetry.fetch resolves with status DONE", async () => {
        fetchMock.mockResolvedValue({
            status: "DONE",
            retries: 1,
            response: { data: "Sample Data" },
            code: 200,
        });

        const response = await request.get("/");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            consumer_pid: process.pid,
            producer_data: { data: "Sample Data" },
            status: "success",
        });
    });

    it("should return failure when HttpRetry.fetch resolves with non-DONE status", async () => {
        fetchMock.mockResolvedValue({
            status: "FAIL",
            retries: 3,
            response: null,
            code: 502,
        });

        const response = await request.get("/");

        expect(response.status).toBe(502);
        expect(response.body).toEqual({
            consumer_pid: process.pid,
            error: "Failed to fetch data from producer",
            status: "failed",
        });
    });

    it("should handle errors thrown by HttpRetry.fetch", async () => {
        fetchMock.mockRejectedValue(new Error("Network Error"));

        const response = await request.get("/");

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            consumer_pid: process.pid,
            error: "Network Error",
            status: "failed",
        });
    });
});
