import Link from "next/link"
import { Calculator, FlaskRoundIcon as Flask, BookOpen, Code, Music, Palette, Globe, Brain } from "lucide-react"

// Define all subjects with their details
const subjects = [
  {
    id: "math",
    title: "Mathematics",
    description: "Develop strong math skills through interactive quizzes",
    icon: Calculator,
    color: "text-math",
    bgColor: "bg-math/10",
    buttonColor: "bg-math",
  },
  {
    id: "science",
    title: "Science",
    description: "Explore the natural world through engaging science quizzes",
    icon: Flask,
    color: "text-science",
    bgColor: "bg-science/10",
    buttonColor: "bg-science",
  },
  {
    id: "reading",
    title: "Reading",
    description: "Enhance reading comprehension and vocabulary skills",
    icon: BookOpen,
    color: "text-reading",
    bgColor: "bg-reading/10",
    buttonColor: "bg-reading",
  },
  {
    id: "coding",
    title: "Coding",
    description: "Learn programming concepts through fun coding challenges",
    icon: Code,
    color: "text-coding",
    bgColor: "bg-coding/10",
    buttonColor: "bg-coding",
  },
  {
    id: "music",
    title: "Music",
    description: "Discover musical concepts and test your knowledge",
    icon: Music,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    buttonColor: "bg-purple-500",
  },
  {
    id: "art",
    title: "Art",
    description: "Explore art history and creative concepts",
    icon: Palette,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    buttonColor: "bg-pink-500",
  },
  {
    id: "geography",
    title: "Geography",
    description: "Learn about countries, cultures, and natural features",
    icon: Globe,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    buttonColor: "bg-green-500",
  },
  {
    id: "history",
    title: "History",
    description: "Discover important historical events and figures",
    icon: Brain,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    buttonColor: "bg-amber-500",
  },
]

export default function QuizPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Interactive Quizzes</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Test your knowledge and challenge yourself with our interactive quizzes across various subjects
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subjects.map((subject) => {
          const SubjectIcon = subject.icon
          return (
            <Link key={subject.id} href={`/quiz/${subject.id}`} className="group">
              <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary hover:border-primary/50 p-6 h-full transition-all duration-300">
                <div className="absolute -inset-px bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 rounded-xl transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-full ${subject.bgColor} flex items-center justify-center mb-4`}>
                    <SubjectIcon className={`h-6 w-6 ${subject.color}`} />
                  </div>
                  <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{subject.title}</h2>
                  <p className="text-muted-foreground">{subject.description}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
