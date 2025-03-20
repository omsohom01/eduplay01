// Learning history service functions

export interface LearningHistory {
    id: string
    userId: string
    subject: string
    topic: string
    content: string
    lastAccessed: Date
    visitCount: number
    progress: number // 0-100
    difficulty: string
    createdAt: Date
    updatedAt: Date
  }
  
  // Get learning history for a specific topic
  export async function getTopicLearningHistory(subject: string, topic: string): Promise<LearningHistory | null> {
    try {
      const response = await fetch(`/api/user/learning-history?subject=${subject}&topic=${topic}`)
  
      if (!response.ok) {
        throw new Error("Failed to fetch learning history")
      }
  
      const data = await response.json()
      return data.history
    } catch (error) {
      console.error("Error fetching learning history:", error)
      return null
    }
  }
  
  // Update learning history for a topic
  export async function updateLearningHistory(
    subject: string,
    topic: string,
    content: string,
    progress: number,
    difficulty: string,
  ): Promise<boolean> {
    try {
      const response = await fetch("/api/user/learning-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          topic,
          content,
          progress,
          difficulty,
        }),
      })
  
      if (!response.ok) {
        throw new Error("Failed to update learning history")
      }
  
      return true
    } catch (error) {
      console.error("Error updating learning history:", error)
      return false
    }
  }
  
  // Get all learning history for a user
  export async function getAllLearningHistory(): Promise<LearningHistory[]> {
    try {
      const response = await fetch("/api/user/learning-history")
  
      if (!response.ok) {
        throw new Error("Failed to fetch learning history")
      }
  
      const data = await response.json()
      return data.history
    } catch (error) {
      console.error("Error fetching all learning history:", error)
      return []
    }
  }
  
  