import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  Code,
  FlaskRoundIcon as Flask,
  Calculator,
  Music,
  Palette,
  Globe,
  Brain,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SubjectsPage() {
  const subjects = [
    {
      title: "Mathematics",
      description: "Learn about numbers, counting, and problem-solving with interactive lessons.",
      icon: Calculator,
      slug: "math",
      color: "text-math",
      bgColor: "bg-math/10",
      borderClass: "gradient-border-math",
      gradientText: "from-math to-blue-400",
    },
    {
      title: "Science",
      description: "Discover the natural world through engaging educational content.",
      icon: Flask,
      slug: "science",
      color: "text-science",
      bgColor: "bg-science/10",
      borderClass: "gradient-border-science",
      gradientText: "from-science to-green-400",
    },
    {
      title: "Reading",
      description: "Build literacy skills with comprehensive reading materials.",
      icon: BookOpen,
      slug: "reading",
      color: "text-reading",
      bgColor: "bg-reading/10",
      borderClass: "gradient-border-reading",
      gradientText: "from-reading to-pink-400",
    },
    {
      title: "Coding",
      description: "Understand programming concepts with detailed explanations.",
      icon: Code,
      slug: "coding",
      color: "text-coding",
      bgColor: "bg-coding/10",
      borderClass: "gradient-border-coding",
      gradientText: "from-coding to-yellow-400",
    },
    {
      title: "Art",
      description: "Explore artistic concepts, techniques, and creative expression.",
      icon: Palette,
      slug: "art",
      color: "text-art",
      bgColor: "bg-art/10",
      borderClass: "gradient-border-math",
      gradientText: "from-art to-purple-400",
    },
    {
      title: "Music",
      description: "Learn about rhythm, sounds, and musical concepts.",
      icon: Music,
      slug: "music",
      color: "text-music",
      bgColor: "bg-music/10",
      borderClass: "gradient-border-science",
      gradientText: "from-music to-amber-400",
    },
    {
      title: "Geography",
      description: "Study countries, cultures, and natural wonders around the world.",
      icon: Globe,
      slug: "geography",
      color: "text-geography",
      bgColor: "bg-geography/10",
      borderClass: "gradient-border-reading",
      gradientText: "from-geography to-teal-400",
    },
    {
      title: "Logic",
      description: "Develop critical thinking and reasoning skills.",
      icon: Brain,
      slug: "logic",
      color: "text-logic",
      bgColor: "bg-logic/10",
      borderClass: "gradient-border-coding",
      gradientText: "from-logic to-indigo-400",
    },
    {
      title: "C Programming",
      description: "Study the fundamentals of C programming language.",
      icon: Code,
      slug: "c_programming",
      color: "text-coding",
      bgColor: "bg-coding/10",
      borderClass: "gradient-border-coding",
      gradientText: "from-coding to-blue-400",
    },
    {
      title: "Python",
      description: "Learn Python programming with comprehensive lessons.",
      icon: Code,
      slug: "python",
      color: "text-coding",
      bgColor: "bg-coding/10",
      borderClass: "gradient-border-coding",
      gradientText: "from-coding to-green-400",
    },
    {
      title: "Java",
      description: "Explore Java programming concepts and object-oriented design.",
      icon: Code,
      slug: "java",
      color: "text-coding",
      bgColor: "bg-coding/10",
      borderClass: "gradient-border-coding",
      gradientText: "from-coding to-orange-400",
    },
  ]

  return (
    <div className="container py-12 md:py-20">
      <div className="relative mb-12 pb-12 border-b">
        <div className="absolute inset-0 pattern-dots opacity-10"></div>
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
            <span>Learning Explorer</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text from-primary via-purple-500 to-pink-500">
            Explore Our Subjects
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Discover a world of knowledge with our comprehensive subject offerings. Each subject features educational
            content followed by timed quizzes to test your understanding.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subjects.map((subject) => (
          <Link key={subject.slug} href={`/subjects/${subject.slug}`} className="group">
            <div
              className={`relative overflow-hidden rounded-xl gradient-border ${subject.borderClass} bg-secondary/30 p-6 h-full transition-all duration-300 hover:bg-secondary/50`}
            >
              <div className="flex flex-col h-full">
                <div className={`w-12 h-12 rounded-full ${subject.bgColor} flex items-center justify-center mb-4`}>
                  <subject.icon className={`h-6 w-6 ${subject.color}`} />
                </div>
                <h3 className={`text-xl font-bold mb-2 group-hover:${subject.color} transition-colors`}>
                  {subject.title}
                </h3>
                <p className="text-muted-foreground flex-grow">{subject.description}</p>
                <div className="mt-4 flex items-center text-sm font-medium">
                  <span
                    className={`gradient-text ${subject.gradientText} opacity-0 group-hover:opacity-100 transition-opacity`}
                  >
                    Learn {subject.title}
                  </span>
                  <ArrowRight
                    className={`ml-1 h-4 w-4 ${subject.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-16 relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-purple-600/20 p-8 pattern-diagonal">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="text-primary font-medium">Want to test your knowledge?</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Take a Quiz Instead</h3>
            <p className="text-muted-foreground">
              If you're ready to test your knowledge, try our interactive quizzes on various subjects.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            <Link href="/quiz">
              Go to Quizzes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}