import express, { Request, Response } from "express";

const app = express();
const port = 5000;

app.get("/", (req: Request, res: Response) => {
    res.send("hello world");
});

app.get("/recipes/:id", (req: Request, res: Response) => {
    console.log(`worker request pid: ${process.pid}`);

    const { id } = req.params;

    if (+id !== 42) {
        res.status(404).json({ error: "Not Found" });
        return;
    }
    res.json({
        producer_pid: process.pid,
        recipe: {
            id: Number(id),
            name: "Chicken Tikka Masala",
            steps: "Throw it in a pot...",
            ingredients: [
                { id: 1, name: "Chicken", quantity: "1 lb" },
                { id: 2, name: "Sauce", quantity: "2 cups" },
            ],
        },
    });
});

app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`);
});

export { app };
