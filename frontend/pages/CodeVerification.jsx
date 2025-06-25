import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail } from "lucide-react"
import { useAuthStore } from "../store/authStore"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
const CodeVerification = () => {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { verifyCode } = useAuthStore()
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (code.length !== 6) {
      setError("Please enter a complete 6-digit code")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
    
      const response = await verifyCode(code)
      if (response.message === "Success") {
        toast.success("Code verified successfully! Redirecting to password reset...")
        navigate("/reset-password")
      } else {
        setError(response.message)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Code</CardTitle>
          <CardDescription>
            We've sent a 6-digit verification code to your email address. Enter the code below to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="verification-code" className="text-sm font-medium text-center block">
                Verification Code
              </label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={(value) => {
                    setCode(value)
                    setError("")
                  }}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || code.length !== 6}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CodeVerification
