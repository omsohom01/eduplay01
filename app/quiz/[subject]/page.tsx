import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
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

// This would typically come from a database or API
const subjectsData = {
  math: {
    title: "Mathematics",
    description: "Develop strong math skills through interactive games and puzzles",
    longDescription:
      "Our mathematics curriculum is designed to make numbers fun and engaging. Through interactive quizzes, puzzles, and activities, children develop strong foundational math skills while enjoying the learning process.",
    icon: Calculator,
    color: "text-math",
    bgColor: "bg-math/10",
    buttonColor: "bg-math",
    gradientText: "from-math to-blue-400",
    topics: [
      {
        id: "counting",
        title: "Counting & Numbers",
        description: "Learn to count and recognize numbers",
        level: "Beginner",
        ageRange: "3-5",
        questionsCount: 10,
      },
      {
        id: "addition",
        title: "Addition",
        description: "Master the basics of adding numbers",
        level: "Beginner",
        ageRange: "5-7",
        questionsCount: 15,
      },
      {
        id: "subtraction",
        title: "Subtraction",
        description: "Learn how to subtract numbers",
        level: "Beginner",
        ageRange: "5-7",
        questionsCount: 15,
      },
      {
        id: "multiplication",
        title: "Multiplication",
        description: "Understand multiplication concepts",
        level: "Intermediate",
        ageRange: "7-9",
        questionsCount: 12,
      },
      {
        id: "division",
        title: "Division",
        description: "Learn how to divide numbers",
        level: "Intermediate",
        ageRange: "7-9",
        questionsCount: 12,
      },
      {
        id: "fractions",
        title: "Fractions",
        description: "Understand parts of a whole",
        level: "Advanced",
        ageRange: "8-10",
        questionsCount: 10,
      },
    ],
  },
  science: {
    title: "Science",
    description: "Explore the natural world through engaging science activities",
    longDescription:
      "Our science curriculum encourages curiosity and exploration. Through interactive quizzes and experiments, children learn about the natural world, scientific principles, and develop critical thinking skills.",
    icon: Flask,
    color: "text-science",
    bgColor: "bg-science/10",
    buttonColor: "bg-science",
    gradientText: "from-science to-green-400",
    topics: [
      {
        id: "animals",
        title: "Animals & Habitats",
        description: "Learn about different animals and where they live",
        level: "Beginner",
        ageRange: "3-6",
        questionsCount: 10,
      },
      {
        id: "plants",
        title: "Plants & Growth",
        description: "Discover how plants grow and change",
        level: "Beginner",
        ageRange: "4-7",
        questionsCount: 10,
      },
      {
        id: "weather",
        title: "Weather & Seasons",
        description: "Learn about different weather patterns and seasons",
        level: "Beginner",
        ageRange: "4-7",
        questionsCount: 10,
      },
      {
        id: "human-body",
        title: "Human Body",
        description: "Explore the amazing human body and how it works",
        level: "Intermediate",
        ageRange: "6-9",
        questionsCount: 12,
      },
      {
        id: "space",
        title: "Space & Planets",
        description: "Journey through our solar system and beyond",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 12,
      },
      {
        id: "simple-machines",
        title: "Simple Machines",
        description: "Learn about levers, pulleys, and other simple machines",
        level: "Advanced",
        ageRange: "8-11",
        questionsCount: 10,
      },
    ],
  },
  reading: {
    title: "Reading",
    description: "Enhance reading comprehension and vocabulary skills",
    longDescription:
      "Our reading curriculum helps children develop strong literacy skills. Through engaging quizzes and activities, children improve their vocabulary, comprehension, and develop a love for reading.",
    icon: BookOpen,
    color: "text-reading",
    bgColor: "bg-reading/10",
    buttonColor: "bg-reading",
    gradientText: "from-reading to-orange-400",
    topics: [
      {
        id: "alphabet",
        title: "Alphabet Recognition",
        description: "Learn to recognize and sound out letters",
        level: "Beginner",
        ageRange: "3-5",
        questionsCount: 10,
      },
      {
        id: "phonics",
        title: "Phonics & Word Sounds",
        description: "Connect letters with their sounds",
        level: "Beginner",
        ageRange: "4-6",
        questionsCount: 12,
      },
      {
        id: "sight-words",
        title: "Sight Words",
        description: "Learn common words by sight",
        level: "Beginner",
        ageRange: "4-7",
        questionsCount: 15,
      },
      {
        id: "vocabulary",
        title: "Vocabulary Building",
        description: "Expand your word knowledge",
        level: "Intermediate",
        ageRange: "6-9",
        questionsCount: 12,
      },
      {
        id: "comprehension",
        title: "Reading Comprehension",
        description: "Understand and analyze what you read",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 10,
      },
      {
        id: "grammar",
        title: "Grammar & Punctuation",
        description: "Learn the rules of language",
        level: "Advanced",
        ageRange: "8-11",
        questionsCount: 12,
      },
    ],
  },
  coding: {
    title: "Coding",
    description: "Learn programming concepts through fun coding challenges",
    longDescription:
      "Our coding curriculum introduces children to the world of programming. Through interactive quizzes and challenges, children learn computational thinking, problem-solving, and basic coding concepts.",
    icon: Code,
    color: "text-coding",
    bgColor: "bg-coding/10",
    buttonColor: "bg-coding",
    gradientText: "from-coding to-indigo-400",
    topics: [
      {
        id: "basics",
        title: "Coding Basics",
        description: "Learn fundamental coding concepts",
        level: "Beginner",
        ageRange: "5-8",
        questionsCount: 10,
      },
      {
        id: "sequences",
        title: "Sequences & Algorithms",
        description: "Create step-by-step instructions",
        level: "Beginner",
        ageRange: "6-9",
        questionsCount: 12,
      },
      {
        id: "loops",
        title: "Loops & Repetition",
        description: "Learn how to repeat actions efficiently",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 10,
      },
      {
        id: "conditionals",
        title: "Conditionals & Logic",
        description: "Make decisions in your code",
        level: "Intermediate",
        ageRange: "8-11",
        questionsCount: 12,
      },
      {
        id: "functions",
        title: "Functions & Procedures",
        description: "Create reusable blocks of code",
        level: "Advanced",
        ageRange: "9-12",
        questionsCount: 10,
      },
      {
        id: "debugging",
        title: "Debugging & Problem Solving",
        description: "Find and fix errors in code",
        level: "Advanced",
        ageRange: "9-12",
        questionsCount: 10,
      },
    ],
  },
  music: {
    title: "Music",
    description: "Discover musical concepts and test your knowledge",
    longDescription:
      "Our music curriculum introduces children to the wonderful world of music. Through interactive quizzes, children learn about musical instruments, notes, rhythms, and famous composers.",
    icon: Music,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    buttonColor: "bg-purple-500",
    gradientText: "from-purple-500 to-purple-300",
    topics: [
      {
        id: "instruments",
        title: "Musical Instruments",
        description: "Learn about different musical instruments",
        level: "Beginner",
        ageRange: "4-7",
        questionsCount: 10,
      },
      {
        id: "notes",
        title: "Notes & Rhythms",
        description: "Understand basic musical notation",
        level: "Beginner",
        ageRange: "5-8",
        questionsCount: 12,
      },
      {
        id: "composers",
        title: "Famous Composers",
        description: "Learn about classical music composers",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 10,
      },
      {
        id: "genres",
        title: "Music Genres",
        description: "Explore different styles of music",
        level: "Intermediate",
        ageRange: "8-11",
        questionsCount: 12,
      },
    ],
  },
  art: {
    title: "Art",
    description: "Explore art history and creative concepts",
    longDescription:
      "Our art curriculum encourages creativity and appreciation for visual arts. Through interactive quizzes, children learn about famous artists, art styles, colors, and artistic techniques.",
    icon: Palette,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    buttonColor: "bg-pink-500",
    gradientText: "from-pink-500 to-pink-300",
    topics: [
      {
        id: "colors",
        title: "Colors & Mixing",
        description: "Learn about primary and secondary colors",
        level: "Beginner",
        ageRange: "3-6",
        questionsCount: 10,
      },
      {
        id: "artists",
        title: "Famous Artists",
        description: "Discover well-known artists and their work",
        level: "Intermediate",
        ageRange: "6-9",
        questionsCount: 12,
      },
      {
        id: "styles",
        title: "Art Styles",
        description: "Explore different artistic movements",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 10,
      },
      {
        id: "techniques",
        title: "Art Techniques",
        description: "Learn about different ways to create art",
        level: "Advanced",
        ageRange: "8-11",
        questionsCount: 12,
      },
    ],
  },
  geography: {
    title: "Geography",
    description: "Learn about countries, cultures, and natural features",
    longDescription:
      "Our geography curriculum helps children understand the world around them. Through interactive quizzes, children learn about countries, continents, landforms, and different cultures.",
    icon: Globe,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    buttonColor: "bg-green-500",
    gradientText: "from-green-500 to-green-300",
    topics: [
      {
        id: "continents",
        title: "Continents & Oceans",
        description: "Learn about the major landmasses and bodies of water",
        level: "Beginner",
        ageRange: "5-8",
        questionsCount: 10,
      },
      {
        id: "countries",
        title: "Countries & Capitals",
        description: "Discover countries and their capital cities",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 15,
      },
      {
        id: "landforms",
        title: "Landforms & Features",
        description: "Explore mountains, rivers, deserts, and more",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 12,
      },
      {
        id: "cultures",
        title: "World Cultures",
        description: "Learn about different cultures around the world",
        level: "Advanced",
        ageRange: "8-11",
        questionsCount: 10,
      },
    ],
  },
  history: {
    title: "History",
    description: "Discover important historical events and figures",
    longDescription:
      "Our history curriculum brings the past to life. Through interactive quizzes, children learn about important historical events, influential figures, and how the past has shaped our present.",
    icon: Brain,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    buttonColor: "bg-amber-500",
    gradientText: "from-amber-500 to-amber-300",
    topics: [
      {
        id: "ancient",
        title: "Ancient Civilizations",
        description: "Explore early human societies and achievements",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 12,
      },
      {
        id: "explorers",
        title: "Famous Explorers",
        description: "Learn about people who discovered new lands",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 10,
      },
      {
        id: "inventions",
        title: "Important Inventions",
        description: "Discover inventions that changed the world",
        level: "Intermediate",
        ageRange: "8-11",
        questionsCount: 12,
      },
      {
        id: "leaders",
        title: "Historical Leaders",
        description: "Learn about influential people throughout history",
        level: "Advanced",
        ageRange: "9-12",
        questionsCount: 10,
      },
    ],
  },
}

export default function QuizSubjectPage({ params }: { params: { subject: string } }) {
  const subject = params.subject

  // Check if the subject exists in our data
  if (!subjectsData[subject as keyof typeof subjectsData]) {
    notFound()
  }

  const subjectData = subjectsData[subject as keyof typeof subjectsData]
  const SubjectIcon = subjectData.icon

  return (
    <div className="container py-12 md:py-20">
      <div className="mb-8">
        <Link
          href="/quiz"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Quizzes
        </Link>

        <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-8 mb-12">
          <div className="absolute inset-0 pattern-diagonal opacity-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className={`w-20 h-20 rounded-full ${subjectData.bgColor} flex items-center justify-center shrink-0`}>
              <SubjectIcon className={`h-10 w-10 ${subjectData.color}`} />
            </div>
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold mb-4 gradient-text ${subjectData.gradientText}`}>
                {subjectData.title} Quizzes
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl">{subjectData.longDescription}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">Quiz Topics</h2>
              <p className="text-muted-foreground">Choose a topic to test your knowledge</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Beginner</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Intermediate</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Advanced</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectData.topics.map((topic) => {
              const levelColor =
                topic.level === "Beginner"
                  ? "bg-green-500"
                  : topic.level === "Intermediate"
                    ? "bg-yellow-500"
                    : "bg-red-500"

              return (
                <Link key={topic.id} href={`/quiz/${subject}/topics/${topic.id}`} className="group">
                  <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary hover:border-primary/50 p-6 h-full transition-all duration-300">
                    <div className="absolute -inset-px bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 rounded-xl transition-all duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{topic.title}</h3>
                        <div className={`w-2.5 h-2.5 rounded-full ${levelColor} mt-2`}></div>
                      </div>
                      <p className="text-muted-foreground mb-4">{topic.description}</p>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div>Ages {topic.ageRange}</div>
                        <div>{topic.questionsCount} questions</div>
                      </div>
                      <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Take Quiz</span>
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
