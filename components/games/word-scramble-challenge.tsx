"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ParticleEffect } from "@/components/ui/particle-effect"
import { RefreshCw, Volume2, VolumeX, Clock, Star, Trophy, Sparkles } from "lucide-react"

// Word lists by difficulty
const wordLists = {
  easy: [
    "cat",
    "dog",
    "sun",
    "hat",
    "run",
    "big",
    "red",
    "box",
    "fox",
    "cup",
    "pen",
    "map",
    "car",
    "bus",
    "toy",
    "bee",
    "egg",
    "ice",
    "jam",
    "key",
  ],
  medium: [
    "apple",
    "happy",
    "tiger",
    "water",
    "music",
    "plant",
    "house",
    "chair",
    "table",
    "bread",
    "clock",
    "green",
    "light",
    "paper",
    "smile",
    "beach",
    "cloud",
    "dream",
    "fruit",
    "heart",
  ],
  hard: [
    "elephant",
    "computer",
    "birthday",
    "mountain",
    "sunshine",
    "rainbow",
    "chocolate",
    "dinosaur",
    "adventure",
    "butterfly",
    "telescope",
    "universe",
    "vegetable",
    "wonderful",
    "beautiful",
    "knowledge",
    "important",
    "different",
    "fantastic",
    "education",
  ],
}

// Hints for words
const wordHints = {
  // Easy words
  cat: "A small furry pet that meows",
  dog: "A loyal pet that barks",
  sun: "It shines in the sky during the day",
  hat: "You wear it on your head",
  run: "Moving fast with your legs",
  big: "Not small",
  red: "The color of apples and fire trucks",
  box: "A container with a lid",
  fox: "A wild animal with a bushy tail",
  cup: "You drink from it",
  pen: "You write with it",
  map: "Shows you where places are",
  car: "A vehicle with four wheels",
  bus: "A large vehicle that carries many people",
  toy: "Something children play with",
  bee: "A flying insect that makes honey",
  egg: "Comes from a chicken",
  ice: "Frozen water",
  jam: "Sweet spread made from fruit",
  key: "Opens a lock",

  // Medium words
  apple: "A round fruit, often red or green",
  happy: "Feeling joy or pleasure",
  tiger: "A large wild cat with stripes",
  water: "You drink it and swim in it",
  music: "Sounds that are pleasant to listen to",
  plant: "A living thing that grows in soil",
  house: "A building where people live",
  chair: "You sit on it",
  table: "You put things on it",
  bread: "A food made from flour",
  clock: "Tells you the time",
  green: "The color of grass",
  light: "Helps you see in the dark",
  paper: "You write on it",
  smile: "What you do when you're happy",
  beach: "Sandy shore by the ocean",
  cloud: "White fluffy thing in the sky",
  dream: "What you see when you sleep",
  fruit: "Sweet food that grows on plants",
  heart: "It pumps blood in your body",

  // Hard words
  elephant: "A large gray animal with a trunk",
  computer: "Electronic device for work and games",
  birthday: "The day you were born",
  mountain: "Very high land that rises up",
  sunshine: "Light and heat from the sun",
  rainbow: "Colorful arc in the sky after rain",
  chocolate: "Sweet brown treat made from cocoa",
  dinosaur: "Extinct reptile from long ago",
  adventure: "Exciting or unusual experience",
  butterfly: "Insect with colorful wings",
  telescope: "Instrument to view distant objects",
  universe: "All of space and everything in it",
  vegetable: "Plant food like carrots or broccoli",
  wonderful: "Extremely good or pleasant",
  beautiful: "Pleasing to look at",
  knowledge: "Information and skills gained through experience",
  important: "Having great significance",
  different: "Not the same",
  fantastic: "Extremely good or attractive",
  education: "Process of receiving or giving instruction",
}

interface Letter {
  id: string
  char: string
  selected: boolean
  position: number
  originalIndex: number
  isCorrect?: boolean
}

type GameState = "start" | "playing" | "paused" | "gameOver"
type Difficulty = "easy" | "medium" | "hard"

export function WordScrambleChallenge() {
  const [gameState, setGameState] = useState<GameState>("start")
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [timeLeft, setTimeLeft] = useState(60)
  const [currentWord, setCurrentWord] = useState("")
  const [scrambledLetters, setScrambledLetters] = useState<Letter[]>([])
  const [selectedLetters, setSelectedLetters] = useState<Letter[]>([])
  const [showHint, setShowHint] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [highScore, setHighScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [showCorrect, setShowCorrect] = useState(false)
  const [usedWords, setUsedWords] = useState<string[]>([])

  const timerRef = useRef<NodeJS.Timeout>()
  const confettiRef = useRef<HTMLDivElement>(null)

  // Scramble a word
  const scrambleWord = (word: string): Letter[] => {
    const letters = word.split("")

    // Create letter objects
    const letterObjects = letters.map((char, index) => ({
      id: `${index}-${char}`,
      char,
      selected: false,
      position: index,
      originalIndex: index,
    }))

    // Shuffle the letters
    for (let i = letterObjects.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[letterObjects[i], letterObjects[j]] = [letterObjects[j], letterObjects[i]]

      // Update positions after shuffle
      letterObjects[i].position = i
      letterObjects[j].position = j
    }

    return letterObjects
  }

  // Get a random word based on difficulty
  const getRandomWord = (): string => {
    const availableWords = wordLists[difficulty].filter((word) => !usedWords.includes(word))

    // If we've used all words, reset the used words list
    if (availableWords.length === 0) {
      setUsedWords([])
      return wordLists[difficulty][Math.floor(Math.random() * wordLists[difficulty].length)]
    }

    return availableWords[Math.floor(Math.random() * availableWords.length)]
  }

  // Set up a new word
  const setupNewWord = () => {
    const word = getRandomWord()
    setCurrentWord(word)
    setUsedWords([...usedWords, word])
    setScrambledLetters(scrambleWord(word))
    setSelectedLetters([])
    setShowHint(false)
    setShowCorrect(false)
  }

  // Start the game
  const startGame = (selectedDifficulty: Difficulty) => {
    setGameState("playing")
    setDifficulty(selectedDifficulty)
    setScore(0)
    setLevel(1)
    setStreak(0)
    setMaxStreak(0)
    setUsedWords([])

    // Set time based on difficulty
    if (selectedDifficulty === "easy") {
      setTimeLeft(60)
    } else if (selectedDifficulty === "medium") {
      setTimeLeft(45)
    } else {
      setTimeLeft(30)
    }

    setupNewWord()

    // Start the timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Pause/resume the game
  const togglePause = () => {
    if (gameState === "playing") {
      setGameState("paused")
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    } else if (gameState === "paused") {
      setGameState("playing")
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  // End the game
  const endGame = () => {
    setGameState("gameOver")
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Update high score if needed
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem("wordScrambleHighScore", score.toString())
    }
  }

  // Handle letter selection
  const handleLetterClick = (letter: Letter) => {
    if (gameState !== "playing" || letter.selected) return

    // Add letter to selected letters
    setSelectedLetters([...selectedLetters, letter])

    // Mark letter as selected
    setScrambledLetters(scrambledLetters.map((l) => (l.id === letter.id ? { ...l, selected: true } : l)))

    // Play sound effect
    if (soundEnabled) {
      playSound("select")
    }
  }

  // Check if the word is correct
  const checkWord = () => {
    if (selectedLetters.length !== currentWord.length) return

    const selectedWord = selectedLetters.map((l) => l.char).join("")

    if (selectedWord === currentWord) {
      // Word is correct
      setShowCorrect(true)

      // Calculate points based on difficulty and word length
      const difficultyMultiplier = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3
      const wordLengthMultiplier = Math.max(1, currentWord.length - 2)
      const points = 10 * difficultyMultiplier * wordLengthMultiplier

      // Update score
      setScore((prev) => prev + points)

      // Update streak
      setStreak((prev) => {
        const newStreak = prev + 1
        if (newStreak > maxStreak) {
          setMaxStreak(newStreak)
        }
        return newStreak
      })

      // Add time bonus
      setTimeLeft((prev) => {
        const timeBonus = difficulty === "easy" ? 5 : difficulty === "medium" ? 4 : 3
        return prev + timeBonus
      })

      // Play sound effect
      if (soundEnabled) {
        playSound("correct")
      }

      // Show correct animation
      if (confettiRef.current) {
        createConfetti()
      }

      // Move to next word after a delay
      setTimeout(() => {
        // Level up every 5 correct words
        if ((score + points) / 50 > level - 1) {
          setLevel((prev) => prev + 1)

          // Play sound effect
          if (soundEnabled) {
            playSound("levelUp")
          }
        }

        setupNewWord()
      }, 1500)
    } else {
      // Word is incorrect
      setStreak(0)

      // Mark letters as incorrect
      setSelectedLetters(selectedLetters.map((l) => ({ ...l, isCorrect: false })))

      // Play sound effect
      if (soundEnabled) {
        playSound("wrong")
      }

      // Reset after a delay
      setTimeout(() => {
        setSelectedLetters([])
        setScrambledLetters(scrambledLetters.map((l) => ({ ...l, selected: false })))
      }, 1000)
    }
  }

  // Reset the current word
  const resetWord = () => {
    setSelectedLetters([])
    setScrambledLetters(scrambledLetters.map((l) => ({ ...l, selected: false })))

    // Play sound effect
    if (soundEnabled) {
      playSound("reset")
    }
  }

  // Show hint
  const toggleHint = () => {
    setShowHint(!showHint)

    // Play sound effect
    if (soundEnabled) {
      playSound("hint")
    }

    // Penalty for using hint
    if (!showHint) {
      setTimeLeft((prev) => Math.max(1, prev - 3))
    }
  }

  // Play a sound effect
  const playSound = (type: "select" | "correct" | "wrong" | "reset" | "hint" | "levelUp") => {
    // In a real implementation, we would play actual sounds
    console.log(`Playing sound: ${type}`)
  }

  // Create confetti effect
  const createConfetti = () => {
    const container = confettiRef.current
    if (!container) return

    const colors = ["#9333ea", "#6366f1", "#ec4899", "#8b5cf6"]

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div")
      confetti.className = "confetti"
      confetti.style.left = `${Math.random() * 100}%`
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.animationDuration = `${Math.random() * 2 + 1}s`
      confetti.style.animationDelay = `${Math.random() * 0.5}s`

      container.appendChild(confetti)

      // Remove confetti after animation
      setTimeout(() => {
        confetti.remove()
      }, 3000)
    }
  }

  // Effect to check if the word is correct when selected letters change
  useEffect(() => {
    if (selectedLetters.length === currentWord.length) {
      checkWord()
    }
  }, [selectedLetters, currentWord])

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("wordScrambleHighScore")
    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore))
    }
  }, [])

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-xl bg-black border border-pink-900 h-[600px]">
        <ParticleEffect
          count={100}
          colors={["#ec4899", "#db2777", "#be185d", "#9d174d"]}
          speed={0.2}
          className="opacity-30"
        />

        <div ref={confettiRef} className="absolute inset-0 overflow-hidden pointer-events-none z-30"></div>

        <div className="relative w-full h-full overflow-hidden flex flex-col">
          {/* Game UI */}
          <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-pink-900/50 backdrop-blur-sm">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-white font-bold">{score}</span>
              </div>

              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-pink-900/50 backdrop-blur-sm">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-white font-bold">Level {level}</span>
              </div>

              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-pink-900/50 backdrop-blur-sm">
                <Clock className="h-4 w-4 text-white" />
                <span className="text-white font-bold">{timeLeft}s</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-pink-900/50 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span className="text-white font-bold">Streak: {streak}</span>
              </div>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-full bg-pink-900/50 backdrop-blur-sm"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4 text-white" /> : <VolumeX className="h-4 w-4 text-white" />}
              </button>

              <button onClick={togglePause} className="p-2 rounded-full bg-pink-900/50 backdrop-blur-sm">
                {gameState === "playing" ? (
                  <span className="h-4 w-4 block relative">
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-1 h-3 bg-white rounded-sm mx-0.5"></span>
                      <span className="w-1 h-3 bg-white rounded-sm mx-0.5"></span>
                    </span>
                  </span>
                ) : (
                  <span className="h-0 w-0 border-t-transparent border-b-transparent border-l-white border-t-[6px] border-b-[6px] border-l-[10px] ml-0.5"></span>
                )}
              </button>
            </div>
          </div>

          {/* Game content */}
          {gameState === "playing" && (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              {/* Selected letters */}
              <div className="mb-8 flex justify-center">
                <div className="flex gap-2">
                  {currentWord.split("").map((char, index) => {
                    const selectedLetter = selectedLetters[index]
                    return (
                      <div
                        key={index}
                        className={`w-12 h-12 rounded-md flex items-center justify-center text-2xl font-bold border-2 transition-all ${
                          selectedLetter
                            ? selectedLetter.isCorrect === false
                              ? "border-red-500 bg-red-500/20 text-white animate-shake"
                              : showCorrect
                                ? "border-green-500 bg-green-500/20 text-white animate-bounce"
                                : "border-pink-500 bg-pink-500/20 text-white"
                            : "border-gray-700 bg-gray-800/50 text-transparent"
                        }`}
                      >
                        {selectedLetter ? selectedLetter.char : char}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Hint */}
              {showHint && (
                <div className="mb-6 px-4 py-2 rounded-lg bg-pink-900/50 backdrop-blur-sm text-white max-w-md text-center">
                  <p>{wordHints[currentWord as keyof typeof wordHints]}</p>
                </div>
              )}

              {/* Scrambled letters */}
              <div className="mb-8">
                <div className="flex flex-wrap justify-center gap-2 max-w-md">
                  {scrambledLetters.map((letter) => (
                    <button
                      key={letter.id}
                      onClick={() => handleLetterClick(letter)}
                      disabled={letter.selected}
                      className={`w-12 h-12 rounded-md flex items-center justify-center text-2xl font-bold transition-all transform ${
                        letter.selected
                          ? "opacity-0 scale-90"
                          : "border-2 border-pink-500 bg-pink-900/50 text-white hover:bg-pink-700/50 hover:scale-105"
                      }`}
                    >
                      {letter.char}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={resetWord}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={selectedLetters.length === 0}
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>

                <Button
                  onClick={toggleHint}
                  variant={showHint ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Hint
                </Button>
              </div>
            </div>
          )}

          {/* Start screen */}
          {gameState === "start" && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
              <h2 className="text-4xl font-bold text-white mb-4 gradient-text from-pink-500 to-purple-500">
                Word Scramble Challenge
              </h2>
              <p className="text-white text-center max-w-md mb-8">
                Unscramble the letters to form words before time runs out!
              </p>

              <div className="flex flex-col items-center mb-8">
                <div className="text-white mb-2">High Score: {highScore}</div>
                <div className="flex items-center gap-2 text-white">
                  <Clock className="h-5 w-5 text-pink-500" />
                  <span>Beat the clock!</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 items-center">
                <h3 className="text-white font-medium">Select Difficulty:</h3>
                <div className="flex gap-3">
                  <Button onClick={() => startGame("easy")} className="bg-green-600 hover:bg-green-700">
                    Easy
                  </Button>
                  <Button onClick={() => startGame("medium")} className="bg-yellow-600 hover:bg-yellow-700">
                    Medium
                  </Button>
                  <Button onClick={() => startGame("hard")} className="bg-red-600 hover:bg-red-700">
                    Hard
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Pause screen */}
          {gameState === "paused" && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
              <h2 className="text-4xl font-bold text-white mb-8">Game Paused</h2>

              <div className="flex gap-4">
                <Button
                  onClick={togglePause}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  Resume
                </Button>

                <Button onClick={() => startGame(difficulty)} variant="outline">
                  Restart
                </Button>
              </div>
            </div>
          )}

          {/* Game over screen */}
          {gameState === "gameOver" && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
              <h2 className="text-4xl font-bold text-white mb-2">Time's Up!</h2>

              <div className="flex items-center gap-2 mb-2">
                <Star className="h-6 w-6 text-yellow-500" />
                <span className="text-2xl text-white">{score} Points</span>
              </div>

              <div className="flex items-center gap-2 mb-8">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <span className="text-xl text-white">Max Streak: {maxStreak}</span>
              </div>

              {score > highScore && (
                <div className="px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-500 font-bold mb-8">
                  New High Score!
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={() => startGame(difficulty)}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  Play Again
                </Button>

                <Button onClick={() => (window.location.href = "/games")} variant="outline">
                  Back to Games
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Game instructions */}
      <div className="mt-8 p-6 rounded-xl bg-secondary/30 border border-secondary">
        <h2 className="text-xl font-bold mb-4">How to Play</h2>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center mt-0.5">
              <span className="text-pink-500 font-bold">1</span>
            </div>
            <p className="flex-1">Unscramble the letters to form the correct word.</p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center mt-0.5">
              <span className="text-pink-500 font-bold">2</span>
            </div>
            <p className="flex-1">Click on the letters in the correct order to form the word.</p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center mt-0.5">
              <span className="text-pink-500 font-bold">3</span>
            </div>
            <p className="flex-1">Use the "Reset" button to start over if you make a mistake.</p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center mt-0.5">
              <span className="text-pink-500 font-bold">4</span>
            </div>
            <p className="flex-1">Use the "Hint" button if you're stuck, but it will cost you time!</p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center mt-0.5">
              <span className="text-pink-500 font-bold">5</span>
            </div>
            <p className="flex-1">Build a streak of correct words to earn bonus points!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
