import type { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password?: string
  createdAt: Date
  lastLogin: Date
  progress: UserProgress
  stats: UserStats
}

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
  userId: string
  type: "quiz" | "game"
  subject?: string
  topic?: string
  difficulty?: string
  score?: number
  totalQuestions?: number
  timeSpent: number
  timestamp: Date
}

export interface UserSession {
  id: string
  name: string
  email: string
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function sanitizeUser(user: User): UserSession {
  return {
    id: user._id?.toString() || "",
    name: user.name,
    email: user.email,
  }
}

export function createDefaultUserData(): Omit<User, "_id" | "email" | "name" | "password"> {
  return {
    createdAt: new Date(),
    lastLogin: new Date(),
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
