import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, MessageSquare, BookOpen, ArrowRight, Target } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
export default function Home() {
  const { user, isAuthenticated } = useAuthStore();
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white mt-0 pt-0">
      <section className="py-20 px-4 mt-0 pt-10">
        <div className="container mx-auto text-center max-w-4xl mt-0">
          <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
            AI-Powered Learning Platform
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Master Pharmacy Through
            <span className="text-emerald-600 block">Interactive Scenarios</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Practice real-world pharmacy cases with our AI chatbot, create personalized flashcards, and navigate complex
            clinical scenarios to build confidence for your career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
           
              {
                !user && !isAuthenticated &&
                <Link to="/login">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-3">
                   Start Learning Now
                  </Button>
                </Link>
              }
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything You Need to Excel</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our comprehensive platform combines AI-powered scenarios with proven learning methods
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Interactive Chatbot Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Practice with realistic patient cases through our AI chatbot. Get instant feedback and learn proper
                  decision-making processes for various pharmacy situations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Smart Flashcards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Create and study with intelligent flashcards that adapt to your learning pace. Focus on areas where
                  you need the most improvement.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Scenario Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Learn step-by-step how to approach complex pharmacy scenarios with guided walkthroughs and best
                  practice recommendations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600">Simple steps to accelerate your pharmacy education</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Scenario</h3>
              <p className="text-slate-600">
                Select from hundreds of real-world pharmacy cases covering different specialties and complexity levels.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Interact with AI</h3>
              <p className="text-slate-600">
                Engage with our intelligent chatbot that simulates real patient interactions and clinical decisions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn & Improve</h3>
              <p className="text-slate-600">
                Receive detailed feedback, create flashcards from your sessions, and track your progress over time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
