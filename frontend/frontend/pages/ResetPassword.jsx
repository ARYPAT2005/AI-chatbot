import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useAuthStore } from "../store/authStore"
import { toast } from "sonner"
const ResetPassword = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const passwordsMatch = password === confirmPassword && password.length > 0
  const showError = confirmPassword.length > 0 && !passwordsMatch
  const {resetPassword} = useAuthStore()
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (passwordsMatch && password.length >= 8) {
      setIsSubmitted(true)
      const response = await resetPassword(password)
      if (response.message === "Password reset successfully") {
        toast.success("Password reset successfully")
      } else {
        toast.error(response.message)
      }
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <h2 className="text-xl font-semibold">Password Reset Successfully</h2>
              <p className="text-muted-foreground">
                Your password has been updated. You can now sign in with your new password.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              {password.length > 0 && password.length < 8 && (
                <p className="text-sm text-red-500">Password must be at least 8 characters</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {showError && (
                <div className="flex items-center space-x-2 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>Passwords do not match</span>
                </div>
              )}
              {passwordsMatch && confirmPassword.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <span>Passwords match</span>
                </div>
              )}
            </div>

            {password.length >= 8 && confirmPassword.length > 0 && !passwordsMatch && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Please make sure both passwords match before submitting.</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={!passwordsMatch || password.length < 8}>
              Reset Password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default ResetPassword
