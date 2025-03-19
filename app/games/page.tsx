import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Gamepad2, Trophy, Star, Clock, Brain, Palette } from "lucide-react"

export default function GamesPage() {
  const games = [
    {
      id: "math-asteroid-blaster",
      title: "Math Asteroid Blaster",
      description: "Blast asteroids by solving math problems in this action-packed space adventure!",
      category: "Mathematics",
      difficulty: "All Levels",
      playTime: "5-10 min",
      skills: ["Quick thinking", "Math skills", "Hand-eye coordination"],
      color: "from-purple-600 to-blue-600",
      textColor: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      id: "word-scramble-challenge",
      title: "Word Scramble Challenge",
      description: "Unscramble letters to form words before time runs out in this fast-paced word game!",
      category: "Reading",
      difficulty: "All Levels",
      playTime: "3-5 min",
      skills: ["Vocabulary", "Spelling", "Word recognition"],
      color: "from-pink-600 to-red-600",
      textColor: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      id: "memory-match",
      title: "Memory Match",
      description: "Test your memory by matching pairs of cards in this classic concentration game!",
      category: "Logic",
      difficulty: "All Levels",
      playTime: "3-8 min",
      skills: ["Memory", "Concentration", "Pattern recognition"],
      color: "from-green-600 to-teal-600",
      textColor: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      id: "art-studio",
      title: "Creative Art Studio",
      description: "Express yourself through digital art with various tools, colors, and templates!",
      category: "Art",
      difficulty: "All Levels",
      playTime: "10-20 min",
      skills: ["Creativity", "Fine motor skills", "Color theory"],
      color: "from-orange-600 to-amber-600",
      textColor: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <div className="container py-12 md:py-20">
      <div className="relative mb-12 pb-12 border-b">
        <div className="absolute inset-0 pattern-dots opacity-10"></div>
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
            <Gamepad2 className="h-3.5 w-3.5 mr-1.5" />
            <span>Educational Entertainment</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text from-primary via-purple-500 to-pink-500">
            Educational Games
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Have fun while learning with our collection of interactive educational games. Challenge yourself, earn
            points, and improve your skills!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {games.map((game) => (
          <Link key={game.id} href={`/games/${game.id}`} className="group">
            <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary hover:border-primary/50 transition-all duration-300">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-5 group-hover:opacity-10 transition-opacity`}
              ></div>

              <div className="relative p-6 z-10">
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full ${game.bgColor} flex items-center justify-center`}>
                      {game.id === "math-asteroid-blaster" ? (
                        <Gamepad2 className={`h-6 w-6 ${game.textColor}`} />
                      ) : game.id === "word-scramble-challenge" ? (
                        <Gamepad2 className={`h-6 w-6 ${game.textColor}`} />
                      ) : game.id === "memory-match" ? (
                        <Brain className={`h-6 w-6 ${game.textColor}`} />
                      ) : (
                        <Palette className={`h-6 w-6 ${game.textColor}`} />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/50 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>{game.playTime}</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/50 text-xs">
                        <Star className="h-3 w-3" />
                        <span>{game.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  <h2 className={`text-2xl font-bold mb-2 group-hover:${game.textColor} transition-colors`}>
                    {game.title}
                  </h2>

                  <p className="text-muted-foreground mb-4">{game.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {game.skills.map((skill, index) => (
                      <div key={index} className="px-2 py-0.5 rounded-full bg-secondary/50 text-xs">
                        {skill}
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{game.category}</span>
                    <div
                      className={`flex items-center text-sm font-medium ${game.textColor} opacity-0 group-hover:opacity-100 transition-opacity`}
                    >
                      <span>Play Now</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
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
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-yellow-500 font-medium">Earn Achievements</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Challenge Yourself!</h3>
            <p className="text-muted-foreground">
              Complete games to earn points, unlock achievements, and track your progress on the leaderboard.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            <Link href="/dashboard">
              View Your Progress
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
