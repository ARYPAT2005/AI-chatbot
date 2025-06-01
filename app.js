import OpenAI from "openai";
import dotenv from "dotenv"
dotenv.config();
const client = new OpenAI({
    apiKey: process.env.OPEN_AI_API
});

const response = await client.responses.create({
    model: "gpt-4.1",
    input: "Write a one-sentence bedtime story about a unicorn."
});

console.log(response.output_text);