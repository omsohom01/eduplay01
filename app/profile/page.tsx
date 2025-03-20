"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, UserIcon, Mail, Calendar, LogOut, Cake } from "lucide-react"
import { getUserData, updateUserProfile } from "@/lib/user-service"

export default function ProfilePage() {
  const { user, loading, logout } = useAuth()
  const [displayName, setDisplayName] = useState("")
  const [age, setAge] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      setDisplayName(user.name || "")

      // Fetch additional user data
      const fetchData = async () => {
        const data = await getUserData(user.id)
        if (data) {
          setUserData(data)
          setAge(data.age?.toString() || "")
        }
      }

      fetchData()
    }
  }, [user])

  const handleSaveProfile = async () => {
    if (!user) return

    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Update profile via API
      await updateUserProfile(displayName, age ? Number.parseInt(age) : undefined)

      setSuccess("Profile updated successfully")
      setIsEditing(false)
    } catch (error: any) {
      setError(error.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  // If not logged in or loading, show loading state
  if (loading) {
    return (
      <div className="container py-12 md:py-20 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    )
  }

  // If not logged in, redirect to sign in page
  if (!user) {
    router.push("/signin")
    return (
      <div className="container py-12 md:py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Sign in to view your profile</h1>
          <p className="text-muted-foreground mb-8">You need to be signed in to view and edit your profile.</p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <a href="/signin">Sign In</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/signup">Create Account</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 gradient-text from-primary via-purple-500 to-pink-500">Your Profile</h1>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>View and edit your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription className="text-green-500">{success}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col md:flex-row gap-6 items-center">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="text-2xl">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-4 flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="displayName">Name</Label>
                    </div>
                    {isEditing ? (
                      <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                    ) : (
                      <p className="text-lg font-medium">{user.name || "Not set"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Cake className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="age">Age</Label>
                    </div>
                    {isEditing ? (
                      <Input
                        id="age"
                        type="number"
                        min="1"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Enter your age"
                      />
                    ) : (
                      <p className="text-lg">{userData?.age || "Not set"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Label>Email</Label>
                    </div>
                    <p className="text-lg">{user.email}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Label>Account Created</Label>
                    </div>
                    <p className="text-lg">
                      {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Statistics</CardTitle>
              <CardDescription>Your learning journey at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-secondary/30 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                  <p className="text-2xl font-bold">{userData?.stats?.totalQuizzesTaken || 0}</p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Correct Answers</p>
                  <p className="text-2xl font-bold">
                    {userData?.stats?.totalQuestionsAnswered
                      ? Math.round((userData.stats.correctAnswers / userData.stats.totalQuestionsAnswered) * 100) + "%"
                      : "0%"}
                  </p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Games Played</p>
                  <p className="text-2xl font-bold">{userData?.stats?.gamesPlayed || 0}</p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Total Time</p>
                  <p className="text-2xl font-bold">
                    {userData?.stats?.totalTimeSpent
                      ? `${Math.floor(userData.stats.totalTimeSpent / 60)}h ${userData.stats.totalTimeSpent % 60}m`
                      : "0h 0m"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

