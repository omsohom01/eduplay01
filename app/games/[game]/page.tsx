"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Gamepad2 } from "lucide-react"
import { MathAsteroidBlaster } from "@/components/games/math-asteroid-blaster"
import { WordScrambleChallenge } from "@/components/games/word-scramble-challenge"

// Game data
const gamesData = {
  "math-asteroid-blaster": {
    title: "Math Asteroid Blaster",
    description: "Blast asteroids by solving math problems in this action-packed space adventure!",
    component: MathAsteroidBlaster,
    category: "Mathematics",
    skills: ["Quick thinking", "Math skills", "Hand-eye coordination"],
    instructions: [
      "Solve the math problem at the top of the screen",
      "Click the button with the correct answer to fire your laser",
      "Move your ship by moving your mouse or finger across the game area",
      "Don't let the correct answer asteroid reach the bottom, or you'll lose a life!",
    ],
  },
  "word-scramble-challenge": {
    title: "Word Scramble Challenge",
    description: "Unscramble letters to form words before time runs out in this fast-paced word game!",
    component: WordScrambleChallenge,
    category: "Reading",
    skills: ["Vocabulary", "Spelling", "Word recognition"],
    instructions: [
      "Unscramble the letters to form the correct word",
      "Click on the letters in the correct order to form the word",
      "Use the 'Reset' button to start over if you make a mistake",
      "Use the 'Hint' button if you're stuck, but it will cost you time!",
    ],
  },
}

export default function GamePage({ params }: { params: { game: string } }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if the game exists
  if (mounted && !gamesData[params.game as keyof typeof gamesData]) {
    notFound()
  }

  if (!mounted) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    )
  }

  const gameData = gamesData[params.game as keyof typeof gamesData]
  const GameComponent = gameData.component

  return (
    <div className="container py-12 md:py-20">
      <div className="mb-8">
        <Link
          href="/games"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Games
        </Link>

        <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-8 mb-12">
          <div className="absolute inset-0 pattern-dots opacity-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Gamepad2 className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text from-primary to-purple-500">
                {gameData.title}
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl">{gameData.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="px-2 py-0.5 rounded-full bg-secondary/50 text-xs">{gameData.category}</div>
                {gameData.skills.map((skill, index) => (
                  <div key={index} className="px-2 py-0.5 rounded-full bg-secondary/50 text-xs">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <GameComponent />
      </div>
    </div>
  )
}

