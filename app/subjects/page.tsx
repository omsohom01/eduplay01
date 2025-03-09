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

export default function SubjectsPage() {
  const subjects = [
    {
      title: "Mathematics",
      description: "Fun puzzles and games that teach numbers, counting, and problem-solving.",
      icon: Calculator,
      slug: "math",
      color: "text-math",
      bgColor: "bg-math/10",
      borderClass: "gradient-border-math",
      gradientText: "from-math to-blue-400",
    },
    {
      title: "Science",
      description: "Exciting experiments and discoveries about the natural world.",
      icon: Flask,
      slug: "science",
      color: "text-science",
      bgColor: "bg-science/10",
      borderClass: "gradient-border-science",
      gradientText: "from-science to-green-400",
    },
    {
      title: "Reading",
      description: "Interactive stories and activities to build literacy skills.",
      icon: BookOpen,
      slug: "reading",
      color: "text-reading",
      bgColor: "bg-reading/10",
      borderClass: "gradient-border-reading",
      gradientText: "from-reading to-pink-400",
    },
    {
      title: "Coding",
      description: "Beginner-friendly programming challenges and logic puzzles.",
      icon: Code,
      slug: "coding",
      color: "text-coding",
      bgColor: "bg-coding/10",
      borderClass: "gradient-border-coding",
      gradientText: "from-coding to-yellow-400",
    },
    {
      title: "Art",
      description: "Creative activities to explore drawing, colors, and artistic expression.",
      icon: Palette,
      slug: "art",
      color: "text-art",
      bgColor: "bg-art/10",
      borderClass: "gradient-border-math",
      gradientText: "from-art to-purple-400",
    },
    {
      title: "Music",
      description: "Fun ways to learn about rhythm, sounds, and musical instruments.",
      icon: Music,
      slug: "music",
      color: "text-music",
      bgColor: "bg-music/10",
      borderClass: "gradient-border-science",
      gradientText: "from-music to-amber-400",
    },
    {
      title: "Geography",
      description: "Explore countries, cultures, and natural wonders around the world.",
      icon: Globe,
      slug: "geography",
      color: "text-geography",
      bgColor: "bg-geography/10",
      borderClass: "gradient-border-reading",
      gradientText: "from-geography to-teal-400",
    },
    {
      title: "Logic",
      description: "Brain teasers and puzzles to develop critical thinking skills.",
      icon: Brain,
      slug: "logic",
      color: "text-logic",
      bgColor: "bg-logic/10",
      borderClass: "gradient-border-coding",
      gradientText: "from-logic to-indigo-400",
    },
    {
      title: "C Programming",
      description: "Learn the fundamentals of C programming language.",
      icon: Code,
      slug: "c_programming",
      color: "text-coding",
      bgColor: "bg-coding/10",
      borderClass: "gradient-border-coding",
      gradientText: "from-coding to-blue-400",
    },
    {
      title: "Python",
      description: "Discover Python programming with fun, interactive lessons.",
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
            <span>Knowledge Explorer</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text from-primary via-purple-500 to-pink-500">
            Explore Our Subjects
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Discover a world of knowledge with our comprehensive subject offerings. Each subject features interactive
            games and activities designed to make learning fun.
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
                    Explore {subject.title}
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
    </div>
  )
}

