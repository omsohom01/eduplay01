// User service functions

export interface UserProgress {
  [subject: string]: number // Progress percentage for each subject
}

export interface UserStats {
  totalQuizzesTaken: number
  totalQuestionsAnswered: number
  correctAnswers: number
  totalTimeSpent: number // in seconds
  gamesPlayed: number
  lastActive: Date
}

export interface UserActivity {
  id: string
  type: string // 'quiz', 'game', 'video', etc.
  subject?: string
  topic?: string
  score?: number
  timeSpent: number // in seconds
  timestamp: Date
}

export interface UserData {
  id: string
  name: string
  email: string
  age?: number
  progress: UserProgress
  stats: UserStats
  activities: UserActivity[]
  createdAt: Date
  updatedAt: Date
}

// Get user data
export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const response = await fetch(`/api/user/data?userId=${userId}`)

    if (!response.ok) {
      throw new Error("Failed to fetch user data")
    }

    const data = await response.json()
    return data.userData
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}

// Update user profile
export async function updateUserProfile(name: string, age?: number): Promise<boolean> {
  try {
    const response = await fetch("/api/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        age,
      }),
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

// Update user progress
export async function updateUserProgress(subject: string, progress: number): Promise<boolean> {
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

// Log user activity
export async function logActivity(
  userId: string,
  activityData: {
    type: string
    subject?: string
    topic?: string
    score?: number
    totalQuestions?: number
    timeSpent: number
    difficulty?: string
  },
): Promise<boolean> {
  try {
    const response = await fetch("/api/user/activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...activityData,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to log activity")
    }

    return true
  } catch (error) {
    console.error("Error logging activity:", error)
    return false
  }
}

// Get user activities
export async function getUserActivities(): Promise<UserActivity[]> {
  try {
    const response = await fetch("/api/user/activity")

    if (!response.ok) {
      throw new Error("Failed to fetch activities")
    }

    const data = await response.json()
    return data.activities
  } catch (error) {
    console.error("Error fetching activities:", error)
    return []
  }
}

