import OpenAI from "openai";
import dotenv from "dotenv"
import express from "express";
import  systemMessage  from "./systemMessage.js";
import cors from "cors";
const app = express();
app.use(cors())
app.use(express.json())
dotenv.config();
const client = new OpenAI({
    apiKey: process.env.OPEN_AI_API
});

let output = "";
let chatOutput =""
app.listen(3000, () => {
    console.log("Server started")
})

app.get('/', (req, res) => {
    res.send(output);
})
app.post('/', async (req, res) => {
    console.log("Recieved body",req.body)
    const body = req.body;
    output = body[2].content;
    const response = await client.responses.create({
        model: "gpt-4o",
        input: [{role:systemMessage.role, content:systemMessage.content},
                ...body
        ]
    });
    chatOutput = response.output_text;
    console.log(chatOutput);
    res.send("Response was a success")
})