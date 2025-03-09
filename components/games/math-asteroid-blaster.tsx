"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ParticleEffect } from "@/components/ui/particle-effect"
import { Rocket, Shield, Star, Zap, Volume2, VolumeX } from "lucide-react"

interface Asteroid {
  id: string
  x: number
  y: number
  size: number
  speed: number
  value: number
  color: string
  rotation: number
  rotationSpeed: number
  hit: boolean
}

interface Laser {
  id: string
  x: number
  y: number
  speed: number
  size: number
  color: string
}

interface Explosion {
  id: string
  x: number
  y: number
  size: number
  frame: number
  maxFrames: number
  color: string
}

type GameState = "start" | "playing" | "paused" | "gameOver"

interface MathProblem {
  question: string
  answer: number
  options: number[]
}

export function MathAsteroidBlaster() {
  const [gameState, setGameState] = useState<GameState>("start")
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [lasers, setLasers] = useState<Laser[]>([])
  const [explosions, setExplosions] = useState<Explosion[]>([])
  const [shipPosition, setShipPosition] = useState(50)
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [highScore, setHighScore] = useState(0)

  const gameAreaRef = useRef<HTMLDivElement>(null)
  const gameLoopRef = useRef<number>()
  const lastAsteroidTimeRef = useRef(0)

  // Generate a math problem based on the current level
  const generateMathProblem = () => {
    let num1, num2, operator, question, answer

    // Adjust difficulty based on level
    if (level <= 2) {
      // Addition and subtraction with small numbers
      num1 = Math.floor(Math.random() * 10) + 1
      num2 = Math.floor(Math.random() * 10) + 1
      operator = Math.random() > 0.5 ? "+" : "-"

      if (operator === "-" && num2 > num1) {
        ;[num1, num2] = [num2, num1] // Swap to avoid negative results
      }

      question = `${num1} ${operator} ${num2}`
      answer = operator === "+" ? num1 + num2 : num1 - num2
    } else if (level <= 4) {
      // Addition, subtraction, and multiplication
      num1 = Math.floor(Math.random() * 12) + 1
      num2 = Math.floor(Math.random() * 12) + 1
      const rand = Math.random()

      if (rand < 0.4) {
        operator = "+"
        question = `${num1} ${operator} ${num2}`
        answer = num1 + num2
      } else if (rand < 0.7) {
        operator = "-"
        if (num2 > num1) {
          ;[num1, num2] = [num2, num1]
        }
        question = `${num1} ${operator} ${num2}`
        answer = num1 - num2
      } else {
        operator = "×"
        question = `${num1} ${operator} ${num2}`
        answer = num1 * num2
      }
    } else {
      // All operations including division
      const rand = Math.random()

      if (rand < 0.3) {
        num1 = Math.floor(Math.random() * 20) + 1
        num2 = Math.floor(Math.random() * 20) + 1
        operator = "+"
        question = `${num1} ${operator} ${num2}`
        answer = num1 + num2
      } else if (rand < 0.6) {
        num1 = Math.floor(Math.random() * 20) + 1
        num2 = Math.floor(Math.random() * 20) + 1
        if (num2 > num1) {
          ;[num1, num2] = [num2, num1]
        }
        operator = "-"
        question = `${num1} ${operator} ${num2}`
        answer = num1 - num2
      } else if (rand < 0.85) {
        num1 = Math.floor(Math.random() * 12) + 1
        num2 = Math.floor(Math.random() * 12) + 1
        operator = "×"
        question = `${num1} ${operator} ${num2}`
        answer = num1 * num2
      } else {
        // Division with whole number results
        num2 = Math.floor(Math.random() * 10) + 1
        answer = Math.floor(Math.random() * 10) + 1
        num1 = num2 * answer
        operator = "÷"
        question = `${num1} ${operator} ${num2}`
      }
    }

    // Generate options (including the correct answer)
    const options = [answer]

    // Add 3 more unique incorrect options
    while (options.length < 4) {
      let incorrectAnswer

      if (operator === "+") {
        incorrectAnswer = answer + Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1)
      } else if (operator === "-") {
        incorrectAnswer = answer + Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1)
      } else if (operator === "×") {
        incorrectAnswer = answer + Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1)
      } else {
        incorrectAnswer = answer + Math.floor(Math.random() * 3) * (Math.random() > 0.5 ? 1 : -1)
      }

      // Ensure no negative or duplicate options
      if (incorrectAnswer > 0 && !options.includes(incorrectAnswer)) {
        options.push(incorrectAnswer)
      }
    }

    // Shuffle options
    const shuffledOptions = options.sort(() => Math.random() - 0.5)

    return {
      question,
      answer,
      options: shuffledOptions,
    }
  }

  // Create a new asteroid
  const createAsteroid = (value: number) => {
    const gameArea = gameAreaRef.current
    if (!gameArea) return null

    const size = Math.random() * 20 + 40
    const speed = (Math.random() * 1 + 0.5) * (level * 0.2 + 1)

    const asteroid: Asteroid = {
      id: Math.random().toString(36).substring(2, 9),
      x: Math.random() * (gameArea.clientWidth - size),
      y: -size,
      size,
      speed,
      value,
      color: getAsteroidColor(value),
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 4,
      hit: false,
    }

    return asteroid
  }

  // Get color based on the asteroid value
  const getAsteroidColor = (value: number) => {
    const colors = [
      "rgba(147, 51, 234, 0.7)", // Purple
      "rgba(99, 102, 241, 0.7)", // Indigo
      "rgba(236, 72, 153, 0.7)", // Pink
      "rgba(139, 92, 246, 0.7)", // Violet
    ]

    return colors[value % colors.length]
  }

  // Create a new laser
  const createLaser = (x: number) => {
    return {
      id: Math.random().toString(36).substring(2, 9),
      x,
      y: gameAreaRef.current?.clientHeight ? gameAreaRef.current.clientHeight - 80 : 500,
      speed: 10,
      size: 4,
      color: "#ec4899",
    }
  }

  // Create an explosion
  const createExplosion = (x: number, y: number, size: number, color: string) => {
    return {
      id: Math.random().toString(36).substring(2, 9),
      x,
      y,
      size,
      frame: 0,
      maxFrames: 20,
      color,
    }
  }

  // Start the game
  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setLevel(1)
    setLives(3)
    setAsteroids([])
    setLasers([])
    setExplosions([])
    setCurrentProblem(generateMathProblem())

    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
    }

    lastAsteroidTimeRef.current = Date.now()
    gameLoop()
  }

  // Pause/resume the game
  const togglePause = () => {
    if (gameState === "playing") {
      setGameState("paused")
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    } else if (gameState === "paused") {
      setGameState("playing")
      gameLoop()
    }
  }

  // Game over
  const endGame = () => {
    setGameState("gameOver")
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
    }

    // Update high score if needed
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem("mathAsteroidHighScore", score.toString())
    }
  }

  // Fire a laser
  const fireLaser = (value: number) => {
    if (gameState !== "playing") return

    // Check if the value matches the answer
    if (currentProblem && value === currentProblem.answer) {
      // Create a laser at the ship position
      const gameArea = gameAreaRef.current
      if (!gameArea) return

      const shipX = (shipPosition / 100) * gameArea.clientWidth
      const newLaser = createLaser(shipX)
      setLasers((prev) => [...prev, newLaser])

      // Play sound effect
      if (soundEnabled) {
        playSound("laser")
      }

      // Generate a new problem
      setCurrentProblem(generateMathProblem())
    } else {
      // Wrong answer - lose a life
      setLives((prev) => prev - 1)

      // Play sound effect
      if (soundEnabled) {
        playSound("wrong")
      }

      if (lives <= 1) {
        endGame()
      }
    }
  }

  // Move the ship
  const moveShip = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (gameState !== "playing") return

    const gameArea = gameAreaRef.current
    if (!gameArea) return

    let clientX: number

    if ("touches" in e) {
      // Touch event
      clientX = e.touches[0].clientX
    } else {
      // Mouse event
      clientX = e.clientX
    }

    const rect = gameArea.getBoundingClientRect()
    const x = clientX - rect.left
    const position = (x / gameArea.clientWidth) * 100

    // Clamp position between 0 and 100
    setShipPosition(Math.max(0, Math.min(100, position)))
  }

  // Play a sound effect
  const playSound = (type: "laser" | "explosion" | "wrong" | "levelUp") => {
    // In a real implementation, we would play actual sounds
    console.log(`Playing sound: ${type}`)
  }

  // Main game loop
  const gameLoop = () => {
    const now = Date.now()
    const gameArea = gameAreaRef.current

    if (!gameArea) {
      gameLoopRef.current = requestAnimationFrame(gameLoop)
      return
    }

    // Create new asteroids
    const asteroidInterval = Math.max(2000 - level * 200, 800)
    if (now - lastAsteroidTimeRef.current > asteroidInterval) {
      if (currentProblem) {
        // Create asteroids with the options
        const newAsteroids = currentProblem.options
          .map((option) => createAsteroid(option))
          .filter(Boolean) as Asteroid[]

        setAsteroids((prev) => [...prev, ...newAsteroids])
      }

      lastAsteroidTimeRef.current = now
    }

    // Update asteroid positions
    setAsteroids((prev) => {
      const updated = prev.map((asteroid) => {
        if (asteroid.hit) return asteroid

        return {
          ...asteroid,
          y: asteroid.y + asteroid.speed,
          rotation: (asteroid.rotation + asteroid.rotationSpeed) % 360,
        }
      })

      // Check for asteroids that have gone off screen
      const filtered = updated.filter((asteroid) => {
        if (asteroid.hit) return true

        if (asteroid.y > gameArea.clientHeight) {
          // If the asteroid had the correct answer, lose a life
          if (currentProblem && asteroid.value === currentProblem.answer) {
            setLives((lives) => {
              const newLives = lives - 1
              if (newLives <= 0) {
                endGame()
              }
              return newLives
            })

            // Generate a new problem
            setCurrentProblem(generateMathProblem())

            // Play sound effect
            if (soundEnabled) {
              playSound("wrong")
            }
          }

          return false
        }

        return true
      })

      return filtered
    })

    // Update laser positions
    setLasers((prev) => {
      const updated = prev.map((laser) => ({
        ...laser,
        y: laser.y - laser.speed,
      }))

      // Remove lasers that have gone off screen
      return updated.filter((laser) => laser.y > -laser.size)
    })

    // Update explosions
    setExplosions((prev) => {
      const updated = prev.map((explosion) => ({
        ...explosion,
        frame: explosion.frame + 1,
      }))

      // Remove completed explosions
      return updated.filter((explosion) => explosion.frame < explosion.maxFrames)
    })

    // Check for collisions between lasers and asteroids
    setLasers((prevLasers) => {
      const remainingLasers = [...prevLasers]

      setAsteroids((prevAsteroids) => {
        const updatedAsteroids = [...prevAsteroids]

        for (let i = remainingLasers.length - 1; i >= 0; i--) {
          const laser = remainingLasers[i]

          for (let j = updatedAsteroids.length - 1; j >= 0; j--) {
            const asteroid = updatedAsteroids[j]

            if (asteroid.hit) continue

            // Check collision
            const dx = laser.x - (asteroid.x + asteroid.size / 2)
            const dy = laser.y - (asteroid.y + asteroid.size / 2)
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < asteroid.size / 2 + laser.size) {
              // Collision detected
              updatedAsteroids[j] = { ...asteroid, hit: true }

              // Create explosion
              setExplosions((prev) => [
                ...prev,
                createExplosion(
                  asteroid.x + asteroid.size / 2,
                  asteroid.y + asteroid.size / 2,
                  asteroid.size,
                  asteroid.color,
                ),
              ])

              // Remove the laser
              remainingLasers.splice(i, 1)

              // Update score
              if (currentProblem && asteroid.value === currentProblem.answer) {
                setScore((prev) => {
                  const newScore = prev + 10 * level

                  // Level up every 100 points
                  if (Math.floor(newScore / 100) > Math.floor(prev / 100)) {
                    setLevel((prevLevel) => prevLevel + 1)

                    // Play sound effect
                    if (soundEnabled) {
                      playSound("levelUp")
                    }
                  }

                  return newScore
                })

                // Generate a new problem
                setCurrentProblem(generateMathProblem())
              }

              // Play sound effect
              if (soundEnabled) {
                playSound("explosion")
              }

              break
            }
          }
        }

        // Remove hit asteroids after a delay
        return updatedAsteroids.filter((asteroid) => !asteroid.hit || asteroid.y < gameArea.clientHeight)
      })

      return remainingLasers
    })

    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("mathAsteroidHighScore")
    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore))
    }
  }, [])

  // Clean up game loop on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-xl bg-black border border-purple-900 h-[600px]">
        <ParticleEffect
          count={100}
          colors={["#9333ea", "#6366f1", "#ec4899", "#8b5cf6"]}
          speed={0.2}
          className="opacity-30"
        />

        <div
          ref={gameAreaRef}
          className="relative w-full h-full overflow-hidden"
          onMouseMove={gameState === "playing" ? moveShip : undefined}
          onTouchMove={gameState === "playing" ? moveShip : undefined}
        >
          {/* Game UI */}
          <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-900/50 backdrop-blur-sm">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-white font-bold">{score}</span>
              </div>

              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-900/50 backdrop-blur-sm">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-white font-bold">Level {level}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: lives }).map((_, i) => (
                  <Shield key={i} className="h-5 w-5 text-red-500" />
                ))}
              </div>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-full bg-purple-900/50 backdrop-blur-sm"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4 text-white" /> : <VolumeX className="h-4 w-4 text-white" />}
              </button>

              <button onClick={togglePause} className="p-2 rounded-full bg-purple-900/50 backdrop-blur-sm">
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

          {/* Current problem */}
          {gameState === "playing" && currentProblem && (
            <div className="absolute top-16 left-0 right-0 z-20 flex justify-center">
              <div className="px-4 py-2 rounded-lg bg-purple-900/70 backdrop-blur-sm text-white font-bold text-xl">
                {currentProblem.question} = ?
              </div>
            </div>
          )}

          {/* Asteroids */}
          {asteroids.map((asteroid) => (
            <div
              key={asteroid.id}
              className="absolute rounded-full flex items-center justify-center"
              style={{
                left: `${asteroid.x}px`,
                top: `${asteroid.y}px`,
                width: `${asteroid.size}px`,
                height: `${asteroid.size}px`,
                backgroundColor: asteroid.color,
                transform: `rotate(${asteroid.rotation}deg)`,
                opacity: asteroid.hit ? 0 : 1,
                transition: asteroid.hit ? "opacity 0.2s" : "none",
              }}
            >
              <span className="text-white font-bold" style={{ fontSize: `${asteroid.size / 3}px` }}>
                {asteroid.value}
              </span>
            </div>
          ))}

          {/* Lasers */}
          {lasers.map((laser) => (
            <div
              key={laser.id}
              className="absolute rounded-full"
              style={{
                left: `${laser.x - laser.size / 2}px`,
                top: `${laser.y - laser.size * 2}px`,
                width: `${laser.size}px`,
                height: `${laser.size * 4}px`,
                backgroundColor: laser.color,
                boxShadow: `0 0 10px ${laser.color}, 0 0 20px ${laser.color}`,
              }}
            />
          ))}

          {/* Explosions */}
          {explosions.map((explosion) => (
            <div
              key={explosion.id}
              className="absolute rounded-full"
              style={{
                left: `${explosion.x - explosion.size / 2}px`,
                top: `${explosion.y - explosion.size / 2}px`,
                width: `${explosion.size * (1 - explosion.frame / explosion.maxFrames)}px`,
                height: `${explosion.size * (1 - explosion.frame / explosion.maxFrames)}px`,
                backgroundColor: "transparent",
                border: `${4 * (1 - explosion.frame / explosion.maxFrames)}px solid ${explosion.color}`,
                opacity: 1 - explosion.frame / explosion.maxFrames,
                boxShadow: `0 0 ${explosion.size / 2}px ${explosion.color}`,
              }}
            />
          ))}

          {/* Ship */}
          <div
            className="absolute bottom-10 w-20 h-20 flex items-center justify-center transition-all duration-100"
            style={{ left: `calc(${shipPosition}% - 40px)` }}
          >
            <div className="relative">
              <Rocket className="h-16 w-16 text-purple-500 transform -rotate-90" />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-10 bg-gradient-to-t from-purple-500 to-transparent rounded-full opacity-70 animate-pulse" />
            </div>
          </div>

          {/* Answer buttons */}
          {gameState === "playing" && currentProblem && (
            <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center p-4 gap-2">
              {currentProblem.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => fireLaser(option)}
                  className="w-16 h-16 rounded-full bg-purple-900/70 backdrop-blur-sm text-white font-bold text-xl hover:bg-purple-700/70 transition-colors flex items-center justify-center"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Start screen */}
          {gameState === "start" && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
              <h2 className="text-4xl font-bold text-white mb-4 gradient-text from-purple-500 to-pink-500">
                Math Asteroid Blaster
              </h2>
              <p className="text-white text-center max-w-md mb-8">
                Solve math problems and blast the asteroid with the correct answer before it hits your ship!
              </p>

              <div className="flex flex-col items-center mb-8">
                <div className="text-white mb-2">High Score: {highScore}</div>
                <div className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5 text-red-500" />
                  <span>= 3 Lives</span>
                </div>
              </div>

              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                size="lg"
              >
                Start Game
              </Button>
            </div>
          )}

          {/* Pause screen */}
          {gameState === "paused" && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
              <h2 className="text-4xl font-bold text-white mb-8">Game Paused</h2>

              <div className="flex gap-4">
                <Button
                  onClick={togglePause}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Resume
                </Button>

                <Button onClick={startGame} variant="outline">
                  Restart
                </Button>
              </div>
            </div>
          )}

          {/* Game over screen */}
          {gameState === "gameOver" && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
              <h2 className="text-4xl font-bold text-white mb-2">Game Over</h2>

              <div className="flex items-center gap-2 mb-8">
                <Star className="h-6 w-6 text-yellow-500" />
                <span className="text-2xl text-white">{score} Points</span>
              </div>

              {score > highScore && (
                <div className="px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-500 font-bold mb-8">
                  New High Score!
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={startGame}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
              <span className="text-purple-500 font-bold">1</span>
            </div>
            <p className="flex-1">Solve the math problem at the top of the screen.</p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
              <span className="text-purple-500 font-bold">2</span>
            </div>
            <p className="flex-1">
              Click the button with the correct answer to fire your laser at the matching asteroid.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
              <span className="text-purple-500 font-bold">3</span>
            </div>
            <p className="flex-1">Move your ship by moving your mouse or finger across the game area.</p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
              <span className="text-purple-500 font-bold">4</span>
            </div>
            <p className="flex-1">Don't let the correct answer asteroid reach the bottom, or you'll lose a life!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

