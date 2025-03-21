import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Clock, Award, Trophy, CheckCircle } from "lucide-react"

// This would typically come from a database or API
const gamesData = {
  math: {
    "counting-adventure": {
      title: "Counting Adventure",
      description: "Learn to count with fun animated characters",
      longDescription:
        "Join our friendly characters on a counting adventure! This game helps children learn to count from 1 to 20 through interactive activities, animations, and rewards. Perfect for beginners who are just starting to learn numbers.",
      image: "/placeholder.svg?height=400&width=600",
      ageRange: "3-5",
      difficulty: "Beginner",
      timeToComplete: "10 min",
      subject: "Mathematics",
      subjectSlug: "math",
      learningObjectives: [
        "Count numbers from 1 to 20",
        "Recognize number symbols",
        "Match quantities with numbers",
        "Understand number sequence",
      ],
      gameComponent: "CountingAdventureGame",
    },
    "addition-blast": {
      title: "Addition Blast",
      description: "Practice addition with colorful interactive games",
      longDescription:
        "Addition Blast makes learning addition fun! Children solve addition problems by blasting the correct answers in this engaging game. With multiple levels of difficulty, it grows with your child's skills.",
      image: "/placeholder.svg?height=400&width=600",
      ageRange: "5-7",
      difficulty: "Beginner",
      timeToComplete: "15 min",
      subject: "Mathematics",
      subjectSlug: "math",
      learningObjectives: [
        "Add numbers from 1 to 10",
        "Recognize addition symbols",
        "Develop mental math skills",
        "Build addition fluency",
      ],
      gameComponent: "AdditionBlastGame",
    },
  },
  science: {
    "animal-explorer": {
      title: "Animal Explorer",
      description: "Learn about different animals and their habitats",
      longDescription:
        "Explore the animal kingdom and discover amazing facts about different animals and where they live. Through interactive activities, children learn about animal classifications, habitats, and behaviors.",
      image: "/placeholder.svg?height=400&width=600",
      ageRange: "3-6",
      difficulty: "Beginner",
      timeToComplete: "15 min",
      subject: "Science",
      subjectSlug: "science",
      learningObjectives: [
        "Identify common animals",
        "Match animals to their habitats",
        "Learn basic animal classifications",
        "Understand animal needs",
      ],
      gameComponent: "AnimalExplorerGame",
    },
  },
  reading: {
    "alphabet-adventure": {
      title: "Alphabet Adventure",
      description: "Learn letters and sounds with fun characters",
      longDescription:
        "Embark on an alphabet adventure with our friendly characters! Children learn to recognize letters, their sounds, and words that begin with each letter through interactive games and activities.",
      image: "/placeholder.svg?height=400&width=600",
      ageRange: "3-5",
      difficulty: "Beginner",
      timeToComplete: "10 min",
      subject: "Reading",
      subjectSlug: "reading",
      learningObjectives: [
        "Recognize all 26 letters",
        "Learn letter sounds",
        "Match letters to beginning sounds",
        "Build letter recognition fluency",
      ],
      gameComponent: "AlphabetAdventureGame",
    },
  },
  coding: {
    "coding-basics": {
      title: "Coding Basics",
      description: "Introduction to coding concepts with visual blocks",
      longDescription:
        "Start your coding journey with this fun introduction to programming concepts. Using visual blocks, children learn the basics of coding logic, sequences, and problem-solving in an engaging environment.",
      image: "/placeholder.svg?height=400&width=600",
      ageRange: "5-7",
      difficulty: "Beginner",
      timeToComplete: "15 min",
      subject: "Coding",
      subjectSlug: "coding",
      learningObjectives: [
        "Understand basic coding concepts",
        "Create simple sequences",
        "Solve visual coding puzzles",
        "Develop computational thinking",
      ],
      gameComponent: "CodingBasicsGame",
    },
  },
}

// Game components
const CountingAdventureGame = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-[500px] flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-4">Counting Adventure</h3>
        <p className="text-muted-foreground">Count the objects and select the correct number!</p>
      </div>

      <div className="flex flex-col items-center space-y-8 w-full max-w-md">
        <div className="grid grid-cols-5 gap-4 w-full">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <img src="/placeholder.svg?height=40&width=40" alt="Counting object" className="w-8 h-8" />
            </div>
          ))}
        </div>

        <p className="text-xl font-bold">How many objects do you see?</p>

        <div className="grid grid-cols-3 gap-4 w-full">
          {[5, 7, 9].map((num) => (
            <Button key={num} variant={num === 7 ? "default" : "outline"} className="h-16 text-xl font-bold">
              {num}
            </Button>
          ))}
        </div>

        <div className="mt-4 w-full">
          <Button className="w-full">Check Answer</Button>
        </div>
      </div>
    </div>
  )
}

const AdditionBlastGame = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-[500px] flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-4">Addition Blast</h3>
        <p className="text-muted-foreground">Solve the addition problem!</p>
      </div>

      <div className="flex flex-col items-center space-y-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-4 text-4xl font-bold">
          <span>3</span>
          <span>+</span>
          <span>4</span>
          <span>=</span>
          <span>?</span>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {[5, 7, 9].map((num) => (
            <Button key={num} variant={num === 7 ? "default" : "outline"} className="h-16 text-xl font-bold">
              {num}
            </Button>
          ))}
        </div>

        <div className="mt-4 w-full">
          <Button className="w-full">Check Answer</Button>
        </div>
      </div>
    </div>
  )
}

const AnimalExplorerGame = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-[500px] flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-4">Animal Explorer</h3>
        <p className="text-muted-foreground">Match the animal to its habitat!</p>
      </div>

      <div className="flex flex-col items-center space-y-8 w-full max-w-md">
        <div className="w-full">
          <img
            src="/placeholder.svg?height=200&width=300"
            alt="Elephant"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <p className="text-xl font-bold text-center">Where does the elephant live?</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          {["Ocean", "Savanna", "Arctic", "Rainforest"].map((habitat) => (
            <Button
              key={habitat}
              variant={habitat === "Savanna" ? "default" : "outline"}
              className="h-16 text-md font-medium"
            >
              {habitat}
            </Button>
          ))}
        </div>

        <div className="mt-4 w-full">
          <Button className="w-full">Check Answer</Button>
        </div>
      </div>
    </div>
  )
}

const AlphabetAdventureGame = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-[500px] flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-4">Alphabet Adventure</h3>
        <p className="text-muted-foreground">Match the letter to a word that starts with it!</p>
      </div>

      <div className="flex flex-col items-center space-y-8 w-full max-w-md">
        <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
          <span className="text-6xl font-bold text-primary">B</span>
        </div>

        <p className="text-xl font-bold">Which word starts with B?</p>

        <div className="grid grid-cols-2 gap-4 w-full">
          {["Apple", "Ball", "Cat", "Dog"].map((word) => (
            <Button key={word} variant={word === "Ball" ? "default" : "outline"} className="h-16 text-md font-medium">
              {word}
            </Button>
          ))}
        </div>

        <div className="mt-4 w-full">
          <Button className="w-full">Check Answer</Button>
        </div>
      </div>
    </div>
  )
}

const CodingBasicsGame = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-[500px] flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-4">Coding Basics</h3>
        <p className="text-muted-foreground">Arrange the blocks to move the character to the star!</p>
      </div>

      <div className="flex flex-col items-center space-y-8 w-full max-w-md">
        <div className="grid grid-cols-5 gap-1 w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className={`w-full aspect-square ${
                i === 0
                  ? "bg-blue-500 rounded-md"
                  : i === 24
                    ? "bg-yellow-500 rounded-md"
                    : "border border-gray-300 dark:border-gray-600"
              }`}
            />
          ))}
        </div>

        <div className="w-full space-y-2">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Move Up
            </Button>
            <Button variant="outline" className="flex-1">
              Move Right
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Move Down
            </Button>
            <Button variant="outline" className="flex-1">
              Move Left
            </Button>
          </div>
        </div>

        <div className="mt-4 w-full">
          <Button className="w-full">Run Code</Button>
        </div>
      </div>
    </div>
  )
}

// Map game IDs to their components
const gameComponents = {
  "counting-adventure": CountingAdventureGame,
  "addition-blast": AdditionBlastGame,
  "animal-explorer": AnimalExplorerGame,
  "alphabet-adventure": AlphabetAdventureGame,
  "coding-basics": CodingBasicsGame,
}

export default function GamePage({ params }: { params: { subject: string; game: string } }) {
  const { subject, game } = params

  // Check if the subject and game exist in our data
  if (!gamesData[subject as keyof typeof gamesData] || !gamesData[subject as keyof typeof gamesData][game as any]) {
    notFound()
  }

  const gameData = gamesData[subject as keyof typeof gamesData][game as any]
  const GameComponent = gameComponents[game as keyof typeof gameComponents]

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Link
          href={`/subjects/${subject}`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to {gameData.subject}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <GameComponent />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{gameData.title}</CardTitle>
                <CardDescription>{gameData.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {gameData.timeToComplete}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {gameData.difficulty}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Ages {gameData.ageRange}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    Learning Objectives
                  </h3>
                  <ul className="space-y-1">
                    {gameData.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About This Game</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{gameData.longDescription}</p>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button className="flex-1">Save Progress</Button>
              <Button variant="outline" className="flex-1">
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

