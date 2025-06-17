import OpenAI from "openai";
import dotenv from "dotenv"
import express from "express";
import  systemMessage  from "./systemMessage.js";
import cors from "cors";
import { connectToDatabase } from "./database/connectionToDB.js";
import authRoutes from "./routes/auth-route.js"
import cookieParser from 'cookie-parser';
const app = express();
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5175',
    credentials: true,
}))
app.use(express.json())
dotenv.config();
const client = new OpenAI({
    apiKey: process.env.OPEN_AI_API
});

let chatOutput =""
app.listen(3000, () => {
    console.log("Server started")
})

app.get('/', (req, res) => {
    
})
app.post('/', async (req, res) => {
    const body = req.body;
    const response = await client.responses.create({
        model: "gpt-4o",
        input: [{role:systemMessage.role, content:systemMessage.content},
                ...body
        ]
    });
    chatOutput = response.output_text;
    res.json(chatOutput)
})

//Database

connectToDatabase();

app.use("/api/auth", authRoutes);

