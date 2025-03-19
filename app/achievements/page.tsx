import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy, BookOpen } from "lucide-react"

export default function AchievementsPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-8 mb-12">
          <div className="absolute inset-0 pattern-dots opacity-10"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text from-primary via-purple-500 to-pink-500">
              Achievements
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Collect achievements as you learn and progress through different subjects.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-xl bg-secondary/30 border border-secondary text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Coming Soon!</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We're working on an exciting achievements system to reward your learning progress.
          </p>
          <Button asChild>
            <Link href="/subjects">
              <BookOpen className="mr-2 h-4 w-4" />
              Explore Subjects
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
