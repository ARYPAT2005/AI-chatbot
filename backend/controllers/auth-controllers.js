import { User } from "../model/user.js";
import bcrypt from "bcrypt";
import { generateVerificationToken } from "./utils/generateVerificationToken.js";
import { generateJWTToken } from "./utils/generateJWTToken.js";
import { sendVerificationEmail, sendWelcomeEmail, sendResetSuccessEmail } from "../resend/email.js";
export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ succes: false, message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10) ;
        const verificationToken = generateVerificationToken();
        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken: verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        })
        user.isVerified = true;
        await user.save();

        generateJWTToken(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);
        
        res.status(201).json({ 
             success: true,
             message: "User created successfully",
             user: {
                ...user._doc,
                password: undefined
             }
        });
    } catch (error) {
        res.status(400).json( {success: false, message: error.message})
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({success: false, message: "Invalid Credentials"})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({success: false, message: "Invalid credentials" })
        }
        const isVerified = user.isVerified
        if(!isVerified) {
            return res.status(400).json({success: false, message: "Email not verified" })
        }
        console.log(res)
        generateJWTToken(res, user._id);
        res.status(200).json({
            success:true,
            message: "Login successful",
            user: {
                ...user._doc,
                password: undefined
             }
        })
    } catch (error) {
        console.log("Error loggin in", error);
        res.status(400).json({success: false, message: error.message })
    }
}
export const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    res.status(200).json({ success:true, message: "Logged out truthfully"})
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await user.findOne({ email });
    } catch (error) {
        
    }
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })
        if(!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code"});
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        await sendWelcomeEmail(user.email, user.name)
        res.status(200).json({ success: true, message: "Email verified successfully"})
    } catch (error) {
        console.log("Error verifying email", error)
        res.status(400).json({ success: false, message: error.message })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await user.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({success: false, message: "Invalid or expired reset token"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({success: true, message: "Password reset successfully"})
    } catch (error) {
        console.log("Error resetting password", error);
        res.status(400).json({success: false, message: error.message});
    }
}
export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(400).json({success: false, message: "User not found"});
        }
        res.status(200).json({ 
            success: true, 
            message: "User was found",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log("Error checking auth", error)
        res.status(400).json({ success: false, message: error.message})
    }
}
