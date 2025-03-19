export interface UserProgress {
  math: number
  science: number
  reading: number
  coding: number
  art: number
  music: number
  geography: number
  logic: number
  movies: number
  c_programming: number
  python: number
  java: number
}

export interface UserStats {
  totalQuizzesTaken: number
  totalQuestionsAnswered: number
  correctAnswers: number
  totalTimeSpent: number
  gamesPlayed: number
}

export interface ActivityLog {
  type: "quiz" | "game"
  subject?: string
  topic?: string
  score?: number
  totalQuestions?: number
  timeSpent: number
}

// Update the getUserData function to properly handle MongoDB data

export async function getUserData(userId: string) {
  try {
    const response = await fetch(`/api/user`)
    if (!response.ok) {
      throw new Error("Failed to fetch user data")
    }
    const data = await response.json()
    return data.user
  } catch (error) {
    console.error("Error getting user data:", error)
    return {
      progress: {
        math: 0,
        science: 0,
        reading: 0,
        coding: 0,
        art: 0,
        music: 0,
        geography: 0,
        logic: 0,
        movies: 0,
        c_programming: 0,
        python: 0,
        java: 0,
      },
      stats: {
        totalQuizzesTaken: 0,
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        totalTimeSpent: 0,
        gamesPlayed: 0,
      },
    }
  }
}

export async function updateUserProfile(name: string) {
  try {
    const response = await fetch("/api/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })

    if (!response.ok) {
      throw new Error("Failed to update profile")
    }

    return true
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}

export async function updateUserProgress(subject: string, progress: number) {
  try {
    const response = await fetch("/api/user/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subject, progress }),
    })

    if (!response.ok) {
      throw new Error("Failed to update progress")
    }

    return true
  } catch (error) {
    console.error("Error updating progress:", error)
    return false
  }
}

// Update the logActivity function to include difficulty
export async function logActivity(
  userId: string,
  activity: {
    type: "quiz" | "game"
    subject?: string
    topic?: string
    difficulty?: string
    score?: number
    totalQuestions?: number
    timeSpent: number
  },
) {
  try {
    const response = await fetch("/api/user/activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        activity: {
          ...activity,
          difficulty: activity.difficulty || "standard", // Add default difficulty
        },
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to log activity")
    }

    return await response.json()
  } catch (error) {
    console.error("Error logging activity:", error)
    return null
  }
}

export async function getUserActivities(limit = 10) {
  try {
    const response = await fetch(`/api/user/activity?limit=${limit}`)

    if (!response.ok) {
      throw new Error("Failed to fetch activities")
    }

    const data = await response.json()
    return data.activities
  } catch (error) {
    console.error("Error getting activities:", error)
    return []
  }
}
