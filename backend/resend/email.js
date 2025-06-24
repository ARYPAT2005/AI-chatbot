import { resend } from "./config.js"
import { verificationTokenEmailTemplate, WELCOME_EMAIL_TEMPLATE, PASSWORD_RESET_EMAIL_TEMPLATE } from "./email-templates.js";
export const sendVerificationEmail = async (email, verificationToken) => {
    try {
       const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [email],
        subject: "Verify Your Email Address Now",
        html: verificationTokenEmailTemplate.replace("{verificationToken}",verificationToken)    
        });
    } catch (error) {
        console.log("Error send verification email", error);
        throw new Error("Error sending verification email")
    }
}

export const sendWelcomeEmail = async (email, name) => {
    try {
        const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to Pharma",
        html: WELCOME_EMAIL_TEMPLATE.replace("{name}",name)
        })
    } catch (error) {
        console.log("Error in welcome Email")
    }
}
export const sendResetSuccessEmail = async (email) => {
    try {
        const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [email],
        subject: "Password Reset was Successful",
        html: `Your passowrd was rest successfully`
        })
    } catch (error) {
        console.log("Error sending password reset successful", error);
    }
}

export const sendPasswordResetEmail = async (email, resetToken) => {
    try {
       const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [email],
        subject: "Reset Your Password",
        html: PASSWORD_RESET_EMAIL_TEMPLATE.replace("{resetToken}", resetToken)    
        });
        if (error) {
            console.log("Error sending password reset email:", error);
            throw new Error("Error sending password reset email");
        }
    } catch (error) {
        console.log("Error sending password reset email:", error);
        throw new Error("Error sending password reset email");
    }
}