import { compare, hash } from "bcryptjs"

export interface UserSession {
  id: string
  name: string
  email: string
}

export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await hash(password, 12)
  return hashedPassword
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  const isValid = await compare(password, hashedPassword)
  return isValid
}

export function sanitizeUser(user: any): UserSession {
  return { id: user._id.toString(), name: user.name, email: user.email }
}

export function createDefaultUserData() {
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
      subjectsExplored: 0,
      topicsStudied: 0,
    },
  }
}

