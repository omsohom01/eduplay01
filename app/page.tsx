import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Brain,
  Sparkles,
  BarChart3,
  Zap,
  BookOpen,
  Code,
  Calculator,
  FlaskRoundIcon as Flask,
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 pattern-dots opacity-20"></div>

        {/* Floating hexagons */}
        <div className="absolute inset-0 hexagon-grid">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="hexagon"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
                transform: `scale(${Math.random() * 1.5 + 0.5})`,
              }}
            ></div>
          ))}
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              <span>AI-Powered Learning for Kids</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight gradient-text from-primary via-purple-500 to-pink-500 leading-tight">
              Make Learning Fun with EduPlay
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl">
              An interactive educational platform designed for children aged 3-12 that combines games, personalized
              learning paths, and real-time progress tracking.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white"
              >
                <Link href="/subjects">
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            <div className="w-full max-w-md mx-auto mt-8 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-3 rounded-lg bg-secondary/50">
                <div className="text-2xl font-bold gradient-text from-primary to-purple-500">500+</div>
                <div className="text-xs text-muted-foreground">Activities</div>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-secondary/50">
                <div className="text-2xl font-bold gradient-text from-primary to-purple-500">8</div>
                <div className="text-xs text-muted-foreground">Subjects</div>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-secondary/50">
                <div className="text-2xl font-bold gradient-text from-primary to-purple-500">10k+</div>
                <div className="text-xs text-muted-foreground">Students</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 bg-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Zap className="h-3.5 w-3.5 mr-1.5" />
              <span>Key Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Choose EduPlay?</h2>
            <p className="text-muted-foreground max-w-[800px]">
              Our platform combines the best of education and entertainment to create an engaging learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative p-6 rounded-xl bg-secondary/30 border border-secondary hover:border-primary/50 transition-all duration-300">
              <div className="absolute -inset-px bg-gradient-to-r from-primary to-purple-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Personalized Learning</h3>
                <p className="text-muted-foreground">
                  AI-powered curriculum tailored to each child's strengths, weaknesses, and learning style.
                </p>
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-secondary/30 border border-secondary hover:border-primary/50 transition-all duration-300">
              <div className="absolute -inset-px bg-gradient-to-r from-primary to-purple-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Interactive Games</h3>
                <p className="text-muted-foreground">
                  Engaging, gamified lessons that make learning enjoyable and motivate kids to keep progressing.
                </p>
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-secondary/30 border border-secondary hover:border-primary/50 transition-all duration-300">
              <div className="absolute -inset-px bg-gradient-to-r from-primary to-purple-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
                <p className="text-muted-foreground">
                  Detailed reports and insights for parents and teachers to monitor learning progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="w-full py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <BookOpen className="h-3.5 w-3.5 mr-1.5" />
              <span>Explore Subjects</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Discover a World of Knowledge</h2>
            <p className="text-muted-foreground max-w-[800px]">
              Explore our comprehensive subject offerings designed to make learning fun and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/subjects/math" className="group">
              <div className="relative overflow-hidden rounded-xl gradient-border gradient-border-math bg-secondary/30 p-6 h-full transition-all duration-300 hover:bg-secondary/50">
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 rounded-full bg-math/10 flex items-center justify-center mb-4">
                    <Calculator className="h-6 w-6 text-math" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-math transition-colors">Mathematics</h3>
                  <p className="text-muted-foreground flex-grow">
                    Fun puzzles and games that teach numbers, counting, and problem-solving.
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-math opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore Math</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/subjects/science" className="group">
              <div className="relative overflow-hidden rounded-xl gradient-border gradient-border-science bg-secondary/30 p-6 h-full transition-all duration-300 hover:bg-secondary/50">
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 rounded-full bg-science/10 flex items-center justify-center mb-4">
                    <Flask className="h-6 w-6 text-science" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-science transition-colors">Science</h3>
                  <p className="text-muted-foreground flex-grow">
                    Exciting experiments and discoveries about the natural world.
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-science opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore Science</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/subjects/reading" className="group">
              <div className="relative overflow-hidden rounded-xl gradient-border gradient-border-reading bg-secondary/30 p-6 h-full transition-all duration-300 hover:bg-secondary/50">
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 rounded-full bg-reading/10 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-reading" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-reading transition-colors">Reading</h3>
                  <p className="text-muted-foreground flex-grow">
                    Interactive stories and activities to build literacy skills.
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-reading opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore Reading</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/subjects/coding" className="group">
              <div className="relative overflow-hidden rounded-xl gradient-border gradient-border-coding bg-secondary/30 p-6 h-full transition-all duration-300 hover:bg-secondary/50">
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 rounded-full bg-coding/10 flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-coding" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-coding transition-colors">Coding</h3>
                  <p className="text-muted-foreground flex-grow">
                    Beginner-friendly programming challenges and logic puzzles.
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-coding opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore Coding</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex justify-center mt-10">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              <Link href="/subjects">
                View All Subjects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-gradient-to-br from-primary/10 to-purple-600/10 pattern-diagonal">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text from-primary to-purple-500">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of children who are learning and having fun with EduPlay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                <Link href="/signup">
                  Sign Up for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

