import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuthStore } from "../store/authStore.js"

export default function VerifyEmail() {
  const Navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef([])
  const { verifyEmail, isLoading, error } = useAuthStore();
  const [input, setInput] = useState("");

  const handleChange = (index, value) => {
    
    if (value.length > 1) return

    
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    
    if (value && index < 5) { 
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newCode = [...code]

    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i]
    }

    setCode(newCode)

    const nextIndex = Math.min(pastedData.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const verificationCode = code.join("")

    if (verificationCode.length === 6) {
      const response = await verifyEmail(verificationCode);
      if (response.success === true ) {
        toast.success("Email Verified! Your email has been verified successfully.")
        Navigate("/Pharma")
      } else {
        toast.error("Verification error")
      }
    }
  }

  const isComplete = code.every((digit) => digit !== "")

  return (
    <>
    <div>
        <Card className="w-full max-w-md mx-auto mt-19">
        <CardHeader className="text-center">
            <CardTitle>Verify Your Email</CardTitle>
            <CardDescription>Enter the 6-digit code sent to your email address</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-2 justify-center">
                {code.map((digit, index) => (
                <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-lg font-semibold"
                    aria-label={`Digit ${index + 1}`}
                />
                ))}
            </div>

            <Button type="submit" className="w-full" disabled={!isComplete}>
                Verify Email
            </Button>
            </form>
        </CardContent>
        </Card>
    </div>
    </>
  )
}
