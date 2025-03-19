"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Gamepad2, Brain, Palette } from "lucide-react"
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
  "memory-match": {
    title: "Memory Match",
    description: "Test your memory by matching pairs of cards in this classic concentration game!",
    component: null, // No component yet
    category: "Logic",
    skills: ["Memory", "Concentration", "Pattern recognition"],
    instructions: [
      "Click on cards to flip them over",
      "Try to find matching pairs of cards",
      "Remember the positions of cards you've seen",
      "Match all pairs to complete the level",
    ],
    comingSoon: true,
  },
  "art-studio": {
    title: "Creative Art Studio",
    description: "Express yourself through digital art with various tools, colors, and templates!",
    component: null, // No component yet
    category: "Art",
    skills: ["Creativity", "Fine motor skills", "Color theory"],
    instructions: [
      "Choose from different drawing tools and brushes",
      "Select colors from the color palette",
      "Use templates as starting points for your creations",
      "Save and share your artwork when finished",
    ],
    comingSoon: true,
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
              {params.game === "math-asteroid-blaster" || params.game === "word-scramble-challenge" ? (
                <Gamepad2 className="h-10 w-10 text-primary" />
              ) : params.game === "memory-match" ? (
                <Brain className="h-10 w-10 text-primary" />
              ) : (
                <Palette className="h-10 w-10 text-primary" />
              )}
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

        {gameData.comingSoon ? (
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary h-[400px] flex flex-col items-center justify-center">
              <div className="absolute inset-0 pattern-diagonal opacity-5"></div>
              <div className="relative z-10 text-center p-8">
                <h2 className="text-3xl font-bold mb-4 gradient-text from-primary to-purple-500">Coming Soon!</h2>
                <p className="text-lg text-muted-foreground max-w-md mx-auto mb-6">
                  We're working hard to bring you this exciting game. Check back soon!
                </p>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  {params.game === "memory-match" ? (
                    <Brain className="h-8 w-8 text-primary" />
                  ) : (
                    <Palette className="h-8 w-8 text-primary" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : GameComponent ? (
          <GameComponent />
        ) : (
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary h-[400px] flex flex-col items-center justify-center">
              <div className="absolute inset-0 pattern-diagonal opacity-5"></div>
              <div className="relative z-10 text-center p-8">
                <h2 className="text-3xl font-bold mb-4 gradient-text from-primary to-purple-500">Game Loading Error</h2>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Sorry, we couldn't load this game. Please try again later.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
