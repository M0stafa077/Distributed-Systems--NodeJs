import request from "supertest";
import { app } from "./index";

describe("Recipe API", () => {
    it("should return hello world", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.text).toBe("hello world");
    });

    it("should return a recipe", async () => {
        const response = await request(app).get("/recipes/42");
        expect(response.status).toBe(200);
        const body = response.body;
        expect(body.recipe.id).toBe(42);
        expect(body.recipe.name).toBe("Chicken Tikka Masala");
    });

    it("should return 404 for unknown recipe", async () => {
        const response = await request(app).get("/recipes/999");
        expect(response.status).toBe(404);
        const body = response.body;
        expect(body.error).toBe("Not Found");
    });
});
