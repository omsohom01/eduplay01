// Gemini API utility functions

interface GeminiQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export async function generateQuestions(topic: string, subject: string, count = 5): Promise<GeminiQuestion[]> {
  const API_KEY = "AIzaSyDiaCC3dAZS8ZiDU1uF8YfEu9PoWy8YLoA"
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

  // Add a timestamp and random seed to ensure different results each time
  const timestamp = Date.now()
  const randomSeed = Math.floor(Math.random() * 10000)

  // Create a prompt based on the topic and subject with explicit instructions for variety
  const prompt = `Generate ${count} NEW, UNIQUE, and DIVERSE educational questions about ${topic} for ${subject} subject for children.
  
  IMPORTANT: Each question must be DIFFERENT from any previous questions. Create VARIED question types and difficulty levels.
  
  For each question:
  1. Create a clear, unique question
  2. Provide 4 distinct possible answers (options)
  3. Indicate which option is correct (as a number 0-3, where 0 is the first option)
  4. Include a child-friendly explanation of the answer
  
  Format the response as a valid JSON array with objects having these properties:
  - question: string
  - options: string[] (array of 4 options)
  - correctAnswer: number (0-3 index of correct option)
  - explanation: string
  
  Example for math addition:
  [
    {
      "question": "What is 5 + 3?",
      "options": ["7", "8", "9", "10"],
      "correctAnswer": 1,
      "explanation": "To add 5 and 3, you count 3 more after 5: 6, 7, 8. So 5 + 3 = 8."
    }
  ]
  
  This is request #${timestamp}-${randomSeed}. Please generate completely new questions different from any previous requests.
  
  IMPORTANT: Return ONLY the JSON array, no other text.`

  try {
    console.log(`Calling Gemini API for ${topic} (${subject}) with seed ${randomSeed}`)
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.9, // Increased temperature for more randomness
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    })

    if (!response.ok) {
      console.error("API request failed with status", response.status)
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log("API response received:", data)

    // Extract the text from the response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      console.error("No text in API response", data)
      throw new Error("No text in API response")
    }

    console.log("Raw API response text:", text)

    // Find the JSON part in the response
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/)
    if (!jsonMatch) {
      console.error("Could not extract JSON from the response", text)
      throw new Error("Could not extract JSON from the response")
    }

    try {
      // Parse the JSON
      const jsonText = jsonMatch[0]
      console.log("Extracted JSON:", jsonText)
      const questions = JSON.parse(jsonText) as GeminiQuestion[]

      // Validate and format the questions
      const formattedQuestions = questions.map((q) => ({
        ...q,
        // Ensure we have exactly 4 options
        options:
          Array.isArray(q.options) && q.options.length >= 4
            ? q.options.slice(0, 4)
            : [
                ...(Array.isArray(q.options) ? q.options : []),
                "Not enough information",
                "None of the above",
                "All of the above",
                "Cannot be determined",
              ].slice(0, 4),
        // Ensure correctAnswer is within bounds
        correctAnswer: typeof q.correctAnswer === "number" ? Math.min(Math.max(0, q.correctAnswer), 3) : 0,
      }))

      console.log(`Successfully generated ${formattedQuestions.length} questions`)
      return formattedQuestions
    } catch (parseError) {
      console.error("Error parsing JSON from API response", parseError, jsonMatch[0])
      throw new Error("Error parsing JSON from API response")
    }
  } catch (error) {
    console.error("Error generating questions:", error)
    // Return fallback questions if API fails
    return getFallbackQuestions(topic, subject)
  }
}

// Provide fallback questions in case the API fails
function getFallbackQuestions(topic: string, subject: string): GeminiQuestion[] {
  // Math fallbacks
  if (subject === "Mathematics") {
    if (topic.toLowerCase().includes("addition")) {
      return [
        {
          question: "What is 2 + 3?",
          options: ["4", "5", "6", "7"],
          correctAnswer: 1,
          explanation: "2 + 3 = 5. You can count up: 2, then 3 more: 3, 4, 5.",
        },
        {
          question: "What is 4 + 2?",
          options: ["5", "6", "7", "8"],
          correctAnswer: 1,
          explanation: "4 + 2 = 6. You can count up: 4, then 2 more: 5, 6.",
        },
        {
          question: "What is 1 + 5?",
          options: ["5", "6", "7", "8"],
          correctAnswer: 1,
          explanation: "1 + 5 = 6. You can count up: 1, then 5 more: 2, 3, 4, 5, 6.",
        },
        {
          question: "What is 3 + 3?",
          options: ["3", "5", "6", "9"],
          correctAnswer: 2,
          explanation: "3 + 3 = 6. This is like adding 3 twice, or doubling 3.",
        },
        {
          question: "What is 5 + 4?",
          options: ["8", "9", "10", "11"],
          correctAnswer: 1,
          explanation: "5 + 4 = 9. You can count up: 5, then 4 more: 6, 7, 8, 9.",
        },
      ]
    } else if (topic.toLowerCase().includes("subtraction")) {
      return [
        {
          question: "What is 5 - 2?",
          options: ["2", "3", "4", "5"],
          correctAnswer: 1,
          explanation: "5 - 2 = 3. You can count down: 5, then 2 less: 4, 3.",
        },
        {
          question: "What is 8 - 3?",
          options: ["3", "4", "5", "6"],
          correctAnswer: 2,
          explanation: "8 - 3 = 5. You can count down: 8, then 3 less: 7, 6, 5.",
        },
        {
          question: "What is 10 - 4?",
          options: ["4", "5", "6", "7"],
          correctAnswer: 2,
          explanation: "10 - 4 = 6. You can count down: 10, then 4 less: 9, 8, 7, 6.",
        },
        {
          question: "What is 7 - 7?",
          options: ["0", "1", "2", "7"],
          correctAnswer: 0,
          explanation: "7 - 7 = 0. When you subtract a number from itself, the answer is always 0.",
        },
        {
          question: "What is 9 - 5?",
          options: ["3", "4", "5", "6"],
          correctAnswer: 1,
          explanation: "9 - 5 = 4. You can count down: 9, then 5 less: 8, 7, 6, 5, 4.",
        },
      ]
    } else if (topic.toLowerCase().includes("multiplication")) {
      return [
        {
          question: "What is 2 × 3?",
          options: ["5", "6", "7", "8"],
          correctAnswer: 1,
          explanation: "2 × 3 = 6. This means 2 groups of 3, so 3 + 3 = 6.",
        },
        {
          question: "What is 4 × 2?",
          options: ["6", "8", "10", "12"],
          correctAnswer: 1,
          explanation: "4 × 2 = 8. This means 4 groups of 2, so 2 + 2 + 2 + 2 = 8.",
        },
        {
          question: "What is 3 × 3?",
          options: ["6", "8", "9", "12"],
          correctAnswer: 2,
          explanation: "3 × 3 = 9. This means 3 groups of 3, so 3 + 3 + 3 = 9.",
        },
        {
          question: "What is 5 × 1?",
          options: ["1", "5", "6", "10"],
          correctAnswer: 1,
          explanation: "5 × 1 = 5. Any number multiplied by 1 equals that number.",
        },
        {
          question: "What is 2 × 5?",
          options: ["7", "8", "10", "12"],
          correctAnswer: 2,
          explanation: "2 × 5 = 10. This means 2 groups of 5, so 5 + 5 = 10.",
        },
      ]
    } else if (topic.toLowerCase().includes("division")) {
      return [
        {
          question: "What is 6 ÷ 2?",
          options: ["2", "3", "4", "5"],
          correctAnswer: 1,
          explanation: "6 ÷ 2 = 3. This means 6 can be divided into 2 equal groups with 3 in each group.",
        },
        {
          question: "What is 8 ÷ 4?",
          options: ["1", "2", "3", "4"],
          correctAnswer: 1,
          explanation: "8 ÷ 4 = 2. This means 8 can be divided into 4 equal groups with 2 in each group.",
        },
        {
          question: "What is 10 ÷ 5?",
          options: ["1", "2", "3", "5"],
          correctAnswer: 1,
          explanation: "10 ÷ 5 = 2. This means 10 can be divided into 5 equal groups with 2 in each group.",
        },
        {
          question: "What is 9 ÷ 3?",
          options: ["2", "3", "4", "6"],
          correctAnswer: 1,
          explanation: "9 ÷ 3 = 3. This means 9 can be divided into 3 equal groups with 3 in each group.",
        },
        {
          question: "What is 4 ÷ 1?",
          options: ["1", "3", "4", "5"],
          correctAnswer: 2,
          explanation: "4 ÷ 1 = 4. Any number divided by 1 equals that number.",
        },
      ]
    } else if (topic.toLowerCase().includes("counting")) {
      return [
        {
          question: "How many apples are there? 🍎🍎🍎🍎",
          options: ["2", "3", "4", "5"],
          correctAnswer: 2,
          explanation: "There are 4 apple emojis. Count them one by one: 1, 2, 3, 4.",
        },
        {
          question: "What number comes after 5?",
          options: ["4", "5", "6", "7"],
          correctAnswer: 2,
          explanation: "The number that comes after 5 is 6. The numbers in order are: 1, 2, 3, 4, 5, 6, 7...",
        },
        {
          question: "What number is between 2 and 4?",
          options: ["1", "3", "5", "6"],
          correctAnswer: 1,
          explanation: "The number between 2 and 4 is 3. The numbers in order are: 1, 2, 3, 4, 5...",
        },
        {
          question: "Count the dots: ● ● ● ●",
          options: ["2", "3", "4", "5"],
          correctAnswer: 2,
          explanation: "There are 4 dots. Count them one by one: 1, 2, 3, 4.",
        },
        {
          question: "What number comes before 3?",
          options: ["1", "2", "3", "4"],
          correctAnswer: 1,
          explanation: "The number that comes before 3 is 2. The numbers in order are: 1, 2, 3, 4...",
        },
      ]
    }
  }

  // Science fallbacks
  if (subject === "Science") {
    if (topic.toLowerCase().includes("animals")) {
      return [
        {
          question: "Where do fish live?",
          options: ["Desert", "Forest", "Water", "Mountains"],
          correctAnswer: 2,
          explanation: "Fish live in water. They have gills that allow them to breathe underwater.",
        },
        {
          question: "Which animal has a trunk?",
          options: ["Lion", "Elephant", "Giraffe", "Zebra"],
          correctAnswer: 1,
          explanation: "Elephants have trunks, which they use for breathing, lifting objects, and getting water.",
        },
        {
          question: "Which animal can fly?",
          options: ["Fish", "Bird", "Snake", "Frog"],
          correctAnswer: 1,
          explanation: "Birds have wings that allow them to fly through the air.",
        },
        {
          question: "Where do polar bears live?",
          options: ["Desert", "Jungle", "Arctic", "Ocean"],
          correctAnswer: 2,
          explanation: "Polar bears live in the Arctic, where it's very cold and there's lots of ice and snow.",
        },
        {
          question: "Which animal has a shell?",
          options: ["Dog", "Cat", "Turtle", "Rabbit"],
          correctAnswer: 2,
          explanation: "Turtles have shells that protect their bodies. The shell is like a home they carry with them.",
        },
      ]
    } else if (topic.toLowerCase().includes("plants")) {
      return [
        {
          question: "What do plants need to grow?",
          options: ["Candy", "Water", "Toys", "Books"],
          correctAnswer: 1,
          explanation: "Plants need water to grow. They also need sunlight and soil with nutrients.",
        },
        {
          question: "Which part of the plant takes in water from the soil?",
          options: ["Leaves", "Stem", "Roots", "Flowers"],
          correctAnswer: 2,
          explanation: "The roots of a plant take in water and nutrients from the soil.",
        },
        {
          question: "What do leaves use to make food for the plant?",
          options: ["Moonlight", "Darkness", "Sunlight", "Rain"],
          correctAnswer: 2,
          explanation: "Leaves use sunlight to make food for the plant through a process called photosynthesis.",
        },
        {
          question: "What color are most leaves?",
          options: ["Blue", "Green", "Purple", "Orange"],
          correctAnswer: 1,
          explanation: "Most leaves are green because they contain a green pigment called chlorophyll.",
        },
        {
          question: "Which part of the plant grows into a fruit or vegetable?",
          options: ["Roots", "Stem", "Leaves", "Flower"],
          correctAnswer: 3,
          explanation: "The flower of a plant grows into a fruit or vegetable after it has been pollinated.",
        },
      ]
    }
  }

  // Reading fallbacks
  if (subject === "Reading") {
    if (topic.toLowerCase().includes("alphabet")) {
      return [
        {
          question: "Which letter makes the 'buh' sound?",
          options: ["A", "B", "C", "D"],
          correctAnswer: 1,
          explanation: "The letter B makes the 'buh' sound, as in 'ball' or 'boy'.",
        },
        {
          question: "Which letter comes after A in the alphabet?",
          options: ["Z", "B", "C", "D"],
          correctAnswer: 1,
          explanation: "B comes after A in the alphabet. The first few letters are: A, B, C, D...",
        },
        {
          question: "Which letter makes the 'sss' sound?",
          options: ["S", "T", "U", "V"],
          correctAnswer: 0,
          explanation: "The letter S makes the 'sss' sound, as in 'snake' or 'sun'.",
        },
        {
          question: "Which word starts with the letter M?",
          options: ["Dog", "Cat", "Mouse", "Fish"],
          correctAnswer: 2,
          explanation: "Mouse starts with the letter M. You can hear the 'mmm' sound at the beginning.",
        },
        {
          question: "How many letters are in the alphabet?",
          options: ["20", "24", "26", "30"],
          correctAnswer: 2,
          explanation: "There are 26 letters in the English alphabet, from A to Z.",
        },
      ]
    } else if (topic.toLowerCase().includes("phonics")) {
      return [
        {
          question: "Which word rhymes with 'cat'?",
          options: ["Dog", "Hat", "Pig", "Cup"],
          correctAnswer: 1,
          explanation: "Hat rhymes with cat. They both end with the 'at' sound.",
        },
        {
          question: "Which word starts with the same sound as 'sun'?",
          options: ["Cat", "Moon", "Sock", "Tree"],
          correctAnswer: 2,
          explanation: "Sock starts with the same 's' sound as sun.",
        },
        {
          question: "How many syllables are in the word 'elephant'?",
          options: ["2", "3", "4", "5"],
          correctAnswer: 1,
          explanation: "Elephant has 3 syllables: el-e-phant.",
        },
        {
          question: "Which word has the long 'e' sound?",
          options: ["Bed", "Red", "Meet", "Let"],
          correctAnswer: 2,
          explanation: "Meet has the long 'e' sound, which sounds like the letter name 'E'.",
        },
        {
          question: "Which word has the 'ch' sound?",
          options: ["Ship", "Chair", "King", "Fish"],
          correctAnswer: 1,
          explanation: "Chair has the 'ch' sound at the beginning.",
        },
      ]
    }
  }

  // Coding fallbacks
  if (subject === "Coding") {
    if (topic.toLowerCase().includes("basics")) {
      return [
        {
          question: "What is an algorithm?",
          options: ["A type of computer", "A step-by-step set of instructions", "A computer game", "A type of robot"],
          correctAnswer: 1,
          explanation: "An algorithm is a step-by-step set of instructions that tells a computer what to do.",
        },
        {
          question: "Which of these is a coding direction?",
          options: ["Jump", "Run", "Move forward", "Dance"],
          correctAnswer: 2,
          explanation: "'Move forward' is a coding direction that tells a character or object which way to go.",
        },
        {
          question: "What happens if you give a computer the wrong instructions?",
          options: [
            "It will fix them for you",
            "It will do what you told it to do, even if it's wrong",
            "It will get angry",
            "Nothing will happen",
          ],
          correctAnswer: 1,
          explanation:
            "Computers follow instructions exactly as given. If the instructions are wrong, the computer will still follow them, which might cause errors.",
        },
        {
          question: "What is a bug in coding?",
          options: [
            "A small insect in the computer",
            "A mistake in the code",
            "A special coding tool",
            "A type of computer",
          ],
          correctAnswer: 1,
          explanation: "A bug is a mistake or error in the code that causes the program not to work as expected.",
        },
        {
          question: "What is the first step in solving a coding problem?",
          options: [
            "Write the code immediately",
            "Ask someone else to do it",
            "Understand the problem",
            "Test the solution",
          ],
          correctAnswer: 2,
          explanation:
            "The first step in solving any coding problem is to understand what the problem is asking you to do.",
        },
      ]
    } else if (topic.toLowerCase().includes("sequences")) {
      return [
        {
          question: "What is a sequence in coding?",
          options: [
            "A type of computer",
            "A series of steps that happen in order",
            "A special coding language",
            "A type of bug",
          ],
          correctAnswer: 1,
          explanation: "A sequence in coding is a series of steps or instructions that happen in a specific order.",
        },
        {
          question: "Which of these is an example of a sequence?",
          options: [
            "If it's raining, take an umbrella",
            "Wake up, brush teeth, eat breakfast",
            "Either play outside or read a book",
            "Repeat jumping 10 times",
          ],
          correctAnswer: 1,
          explanation: "Wake up, brush teeth, eat breakfast is a sequence because it's a series of steps in order.",
        },
        {
          question: "Why are sequences important in coding?",
          options: [
            "They make the code look prettier",
            "They help the computer run faster",
            "They tell the computer what to do and when to do it",
            "They are not important in coding",
          ],
          correctAnswer: 2,
          explanation: "Sequences are important because they tell the computer exactly what to do and in what order.",
        },
        {
          question: "What happens if you change the order of steps in a sequence?",
          options: [
            "Nothing, the order doesn't matter",
            "The computer will fix the order",
            "The result might be different",
            "The code won't run at all",
          ],
          correctAnswer: 2,
          explanation:
            "If you change the order of steps in a sequence, the result might be different. For example, putting on socks after shoes doesn't work well!",
        },
        {
          question: "Which of these is NOT a sequence?",
          options: [
            "A recipe for baking cookies",
            "Directions to a friend's house",
            "Choosing between two different games",
            "The steps to solve a math problem",
          ],
          correctAnswer: 2,
          explanation:
            "Choosing between two different games is not a sequence; it's a choice or selection, which is different from a series of steps.",
        },
      ]
    }
  }

  // Default fallback for any other topic
  return [
    {
      question: `Sample question for ${topic} in ${subject}`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0,
      explanation: "This is a sample explanation for the correct answer.",
    },
    {
      question: `Another sample question about ${topic}`,
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correctAnswer: 1,
      explanation: "This is another sample explanation.",
    },
    {
      question: `Third question related to ${topic}`,
      options: ["First choice", "Second choice", "Third choice", "Fourth choice"],
      correctAnswer: 2,
      explanation: "This is a third sample explanation.",
    },
    {
      question: `Fourth question about ${topic}`,
      options: ["Answer A", "Answer B", "Answer C", "Answer D"],
      correctAnswer: 3,
      explanation: "This is a fourth sample explanation.",
    },
    {
      question: `Final question on ${topic}`,
      options: ["Selection 1", "Selection 2", "Selection 3", "Selection 4"],
      correctAnswer: 0,
      explanation: "This is the final sample explanation.",
    },
  ]
}
