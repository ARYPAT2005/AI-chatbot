import OpenAI from "openai";
import dotenv from "dotenv"
import express from "express";
import  {systemMessage, systemMessageFlashcards}  from "./systemMessage.js";
import cors from "cors";
import { connectToDatabase } from "./database/connectionToDB.js";
import authRoutes from "./routes/auth-route.js"
import cookieParser from 'cookie-parser';
import { User } from "./model/user.js";
import { verifyToken } from "./middleware/verifyToken.js";
import { generateVerificationToken } from "./controllers/utils/generateVerificationToken.js";
import { sendPasswordResetEmail } from "./resend/email.js";


const app = express();
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5174',
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

app.post("/create-flashcards", async (req, res) => {
    const { words } = req.body;
    const response = await client.responses.create({
        model: "gpt-4o",
        input: [{role:systemMessageFlashcards.role, content:systemMessageFlashcards.content},
                { role: "user", content: words }
        ]
    });
    res.json(response.output_text)
})

app.post("/save-flashcards", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.flashcards.push(req.body.flashcards);
        await user.save();
        res.json({ message: "Flashcards saved successfully", flashcards: user.flashcards });
    } catch (error) {
        console.log("Error saving flashcards:", error);
        res.status(500).json({ message: "Failed to save flashcards" });
    }
})
app.get("/get-flashcards", verifyToken, async(req, res) => {
    try {
        const user = await User.findById(req.userId)
         if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({flashcards: user.flashcards})
    } catch {
        res.status(500).json({ message: "Failed to get the saved flashcards" });
    }
})
app.put("/update-past-decks", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log(req.body)
        user.flashcards = req.body.pastDecks;
        await user.save();
        res.json({message: "Past decks updated successfully", pastDecks: user.flashcards})
    } catch (error) {
        console.log("Error updating past decks:", error);
        res.status(500).json({ message: "Failed to update past decks" });
    }
})
app.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Password reset requested for:", email);
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = generateVerificationToken();
        
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        
        await user.save();
        
        await sendPasswordResetEmail(email, resetToken);
        
        res.json({ message: "Password reset link sent to email" });
    } catch (error) {
        console.log("Error in forgot password:", error);
        res.status(500).json({ message: "Failed to process password reset request" });
    }
});

app.post("/reset-password", async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body;
        
        const user = await User.findOne({ 
            email,
            resetPasswordToken: resetToken,
            resetPasswordExpiresAt: { $gt: new Date() }
        });
        
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }
        const bcrypt = await import('bcrypt');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        
        await user.save();
        
        res.json({ message: "Password reset successfully" });
    } catch (error) {
        console.log("Error resetting password:", error);
        res.status(500).json({ message: "Failed to reset password" });
    }
});
app.post("/verify-code", async (req, res) => {
    const { code, email } = req.body;
    console.log(code,email)
    try {
        const user = await User.findOne({ 
            email,
            resetPasswordToken: code ,
            resetPasswordExpiresAt: { $gt: new Date() }
         });
         if (!user) {
             return res.status(404).json({ message: "Invalid code" });
         }
         console.log(user)
         return res.json({ message: "Success" }); 
    } catch (error) {
        console.log("Error verifying code:", error);
        res.status(500).json({ message: "Failed" });
    }
})  
app.post("/reset-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        
        console.log("Reset password request:", { email, resetToken, newPassword: "***" });
        
        const user = await User.findOne({ 
            email
        });
        
        if (!user) {
            console.log("No user found with valid token");
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }
        
        const bcrypt = await import('bcrypt');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        
        await user.save();
        
        const { generateJWTToken } = await import('./controllers/utils/generateJWTToken.js');
        generateJWTToken(res, user._id);
        
        console.log("Password reset successful for user:", user.email);
        
        res.json({ 
            message: "Password reset successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        console.log("Error resetting password:", error);
        res.status(500).json({ message: "Failed to reset password" });
    }
});



connectToDatabase();

app.use("/api/auth", authRoutes);

