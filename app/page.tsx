import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Calculator,
  FlaskRoundIcon as Flask,
  BookOpen,
  Code,
  Trophy,
  Video,
  Gamepad2,
  MessageSquare,
} from "lucide-react"

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 z-0"></div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Learning Made <span className="text-primary">Fun</span> and{" "}
                <span className="text-primary">Interactive</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Explore subjects, play educational games, and track your progress with our interactive learning
                platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/subjects">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Learning
                  </Button>
                </Link>
                <Link href="/quiz">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Take a Quiz
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-px bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
              <div className="grid grid-cols-2 gap-4 p-1">
                <div className="bg-card p-6 rounded-xl shadow-lg">
                  <Calculator className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-bold mb-1">Mathematics</h3>
                  <p className="text-sm text-muted-foreground">Numbers, shapes, and patterns</p>
                </div>
                <div className="bg-card p-6 rounded-xl shadow-lg">
                  <Flask className="h-8 w-8 text-green-500 mb-3" />
                  <h3 className="font-bold mb-1">Science</h3>
                  <p className="text-sm text-muted-foreground">Explore the natural world</p>
                </div>
                <div className="bg-card p-6 rounded-xl shadow-lg">
                  <BookOpen className="h-8 w-8 text-orange-500 mb-3" />
                  <h3 className="font-bold mb-1">Reading</h3>
                  <p className="text-sm text-muted-foreground">Words, stories, and language</p>
                </div>
                <div className="bg-card p-6 rounded-xl shadow-lg">
                  <Code className="h-8 w-8 text-indigo-500 mb-3" />
                  <h3 className="font-bold mb-1">Coding</h3>
                  <p className="text-sm text-muted-foreground">Logic and problem-solving</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How EduPlay Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform offers multiple ways to learn and engage with educational content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Learn with Subjects</h3>
              <p className="text-muted-foreground mb-4">
                Explore educational content across various subjects and topics, with interactive lessons designed for
                different age groups.
              </p>
              <Link href="/subjects">
                <Button variant="outline" className="w-full">
                  Explore Subjects
                </Button>
              </Link>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Test Your Knowledge</h3>
              <p className="text-muted-foreground mb-4">
                Challenge yourself with quizzes at different difficulty levels, from easy to advanced, and track your
                progress over time.
              </p>
              <Link href="/quiz">
                <Button variant="outline" className="w-full">
                  Take Quizzes
                </Button>
              </Link>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Gamepad2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Learn Through Play</h3>
              <p className="text-muted-foreground mb-4">
                Make learning fun with interactive educational games that reinforce concepts while providing
                entertainment and engagement.
              </p>
              <Link href="/games">
                <Button variant="outline" className="w-full">
                  Play Games
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Video Search Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Educational Videos</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Use our AI-powered video search to find the best educational videos for any topic. Perfect for visual
                learners!
              </p>
              <div className="bg-card p-6 rounded-xl mb-6 shadow-sm border border-border">
                <p className="italic text-muted-foreground">
                  "The video search feature helped my child find exactly what they needed to understand fractions
                  better!"
                </p>
                <p className="font-medium mt-2">— Parent of 8-year-old</p>
              </div>
              <Link href="/video-search">
                <Button size="lg" className="flex items-center gap-2 w-full sm:w-auto">
                  <Video className="h-5 w-5" />
                  Try Video Search
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="relative rounded-xl overflow-hidden shadow-lg border border-border">
                <div className="aspect-video bg-card flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-50"></div>
                  <div className="relative z-10 p-6 text-center">
                    <Video className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Educational Videos</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">
                      Find age-appropriate videos on any subject with our AI-powered search
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center">
                  <div className="bg-primary/90 text-primary-foreground px-4 py-2 rounded-full font-medium shadow-lg">
                    Kid-friendly videos
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot Section */}
      <section className="py-20 bg-primary/5">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ask Our AI Assistant</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Have questions about any subject? Our AI chatbot is here to help you learn and understand concepts
                better.
              </p>
              <div className="bg-card p-6 rounded-xl mb-6 shadow-sm border border-border">
                <p className="italic text-muted-foreground">
                  "The chatbot helped me understand fractions when I was stuck on my homework!"
                </p>
                <p className="font-medium mt-2">— Student, age 10</p>
              </div>
              <Link href="/chatbot">
                <Button size="lg" className="flex items-center gap-2 w-full sm:w-auto">
                  <MessageSquare className="h-5 w-5" />
                  Chat with AI
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="relative rounded-xl overflow-hidden shadow-lg border border-border">
                <div className="aspect-video bg-card flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-50"></div>
                  <div className="relative z-10 p-6 text-center">
                    <MessageSquare className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">AI Learning Assistant</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">
                      Get help with homework, learn new concepts, or explore any educational topic
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center">
                  <div className="bg-primary/90 text-primary-foreground px-4 py-2 rounded-full font-medium shadow-lg">
                    Available 24/7
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join thousands of children who are learning and having fun with EduPlay's interactive educational platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/subjects">
              <Button size="lg">Explore Subjects</Button>
            </Link>
            <Link href="/quiz">
              <Button size="lg" variant="outline">
                Take a Quiz
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

