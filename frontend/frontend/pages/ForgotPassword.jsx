import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { forgotPassword, message, error, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  async function onSubmit(e) {
    e.preventDefault();
    const response = await forgotPassword(email);
    
    if (response && response.message === "Password reset link sent to email") {
      toast.success(response.message)
      navigate("/code-verification")
     set({isLoading: false})
    } else {
      toast.error("The email you entered is not registered")
      set({isLoading: false})
    }
  }

  return (
    <>
    <div className="flex justify-center items-center min-h-screen">
         <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button type="submit" 
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg mt-8"
            disabled={isLoading}>
              {isLoading ? "Sending..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
     
    </>
    
  );
}