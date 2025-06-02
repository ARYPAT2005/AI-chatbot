import OpenAI from "openai";
import dotenv from "dotenv"
import express from "express";
import cors from "cors";
const app = express();
app.use(cors())
app.use(express.json())
dotenv.config();
const client = new OpenAI({
    apiKey: process.env.OPEN_AI_API
});

const response = await client.responses.create({
    model: "gpt-4.1",
    input: "Write a one-sentence bedtime story about a unicorn."
});

app.listen(3000, () => {
    console.log("Server started")
})

app.get('/', (req, res) => {
    res.send("<h1>Hellos</h1>")
})
app.post('/', (req, res) => {
    res.json({ message: "Hello from backend! Data received." });
})





