import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  Clock,
  Code,
  FlaskRoundIcon as Flask,
  Trophy,
  Award,
} from "lucide-react"

export default function DashboardPage() {
  // This would typically come from a database or API
  const recentActivities = [
    {
      id: "counting",
      title: "Counting & Numbers",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      lastPlayed: "2 hours ago",
      progress: 75,
    },
    {
      id: "alphabet",
      title: "Alphabet Recognition",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "bg-reading",
      lastPlayed: "Yesterday",
      progress: 60,
    },
    {
      id: "animals",
      title: "Animals & Habitats",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "bg-science",
      lastPlayed: "3 days ago",
      progress: 40,
    },
  ]

  const achievements = [
    {
      title: "Math Master",
      description: "Completed 10 math activities",
      icon: Calculator,
      color: "text-math",
      bgColor: "bg-math/10",
      earned: true,
    },
    {
      title: "Reading Rockstar",
      description: "Read 5 interactive stories",
      icon: BookOpen,
      color: "text-reading",
      bgColor: "bg-reading/10",
      earned: true,
    },
    {
      title: "Science Explorer",
      description: "Completed 5 science experiments",
      icon: Flask,
      color: "text-science",
      bgColor: "bg-science/10",
      earned: false,
    },
    {
      title: "Coding Wizard",
      description: "Created 3 coding projects",
      icon: Code,
      color: "text-coding",
      bgColor: "bg-coding/10",
      earned: false,
    },
  ]

  const subjectProgress = [
    {
      subject: "Mathematics",
      progress: 65,
      color: "bg-math",
    },
    {
      subject: "Reading",
      progress: 45,
      color: "bg-reading",
    },
    {
      subject: "Science",
      progress: 30,
      color: "bg-science",
    },
    {
      subject: "Coding",
      progress: 15,
      color: "bg-coding",
    },
  ]

  const recommendedTopics = [
    {
      id: "addition",
      title: "Addition",
      subject: "Mathematics",
      subjectSlug: "math",
      level: "Beginner",
      ageRange: "5-7",
      questionsCount: 15,
    },
    {
      id: "phonics",
      title: "Phonics",
      subject: "Reading",
      subjectSlug: "reading",
      level: "Beginner",
      ageRange: "4-6",
      questionsCount: 15,
    },
    {
      id: "plants",
      title: "Plants & Growth",
      subject: "Science",
      subjectSlug: "science",
      level: "Beginner",
      ageRange: "5-8",
      questionsCount: 12,
    },
  ]

  return (
    <div className="container py-12 md:py-20">
      <div className="relative mb-12 pb-12 border-b">
        <div className="absolute inset-0 pattern-dots opacity-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text from-primary via-purple-500 to-pink-500">
              Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">Track your progress and continue your learning journey</p>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            <Link href="/subjects">
              Explore Subjects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="group relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6 transition-all duration-300 hover:bg-secondary/50">
          <div className="absolute -inset-px bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 rounded-xl transition-all duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Total Learning Time</h3>
                <p className="text-muted-foreground text-sm">This week</p>
              </div>
            </div>
            <div className="text-3xl font-bold">3h 45m</div>
            <p className="text-xs text-muted-foreground mt-1">+15% from last week</p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6 transition-all duration-300 hover:bg-secondary/50">
          <div className="absolute -inset-px bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 rounded-xl transition-all duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Activities Completed</h3>
                <p className="text-muted-foreground text-sm">This week</p>
              </div>
            </div>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">+3 from last week</p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6 transition-all duration-300 hover:bg-secondary/50">
          <div className="absolute -inset-px bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 rounded-xl transition-all duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Achievements</h3>
                <p className="text-muted-foreground text-sm">Total earned</p>
              </div>
            </div>
            <div className="text-3xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">2 new this week</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6">
            <div className="absolute inset-0 pattern-diagonal opacity-5"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recent Activities</h2>
                <Button variant="ghost" size="sm" asChild className="text-sm">
                  <Link href="/history">
                    View All
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="group relative overflow-hidden rounded-lg bg-secondary/50 border border-secondary hover:border-primary/50 p-4 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                              {activity.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {activity.subject} • {activity.lastPlayed}
                            </p>
                          </div>
                          <Button asChild size="sm" variant="ghost" className={`${activity.subjectColor} text-white`}>
                            <Link href={`/subjects/${activity.subjectSlug}/topics/${activity.id}`}>Continue</Link>
                          </Button>
                        </div>
                        <div className="mt-2">
                          <Progress value={activity.progress} color={activity.subjectColor} className="h-1.5" />
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-muted-foreground">{activity.progress}% complete</span>
                            <span className="text-xs text-muted-foreground">
                              {Math.round((100 - activity.progress) / 20)} questions left
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6 h-full">
            <div className="absolute inset-0 pattern-diagonal opacity-5"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Achievements</h2>
                <Button variant="ghost" size="sm" asChild className="text-sm">
                  <Link href="/achievements">
                    View All
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-lg bg-secondary/50 border border-secondary hover:border-primary/50 p-4 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${achievement.bgColor} flex items-center justify-center ${achievement.earned ? "" : "opacity-50"}`}
                      >
                        <achievement.icon
                          className={`h-5 w-5 ${achievement.color} ${achievement.earned ? "" : "opacity-50"}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium truncate ${achievement.earned ? "" : "text-muted-foreground"}`}>
                          {achievement.title}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
                      </div>
                      {achievement.earned && <Award className="h-5 w-5 text-yellow-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div>
          <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6 h-full">
            <div className="absolute inset-0 pattern-diagonal opacity-5"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Subject Progress</h2>
                <Button variant="ghost" size="sm" asChild className="text-sm">
                  <Link href="/progress">
                    Details
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-6">
                {subjectProgress.map((subject) => (
                  <div key={subject.subject} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{subject.subject}</span>
                      <span className="font-medium">{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} color={subject.color} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6">
            <div className="absolute inset-0 pattern-diagonal opacity-5"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recommended For You</h2>
                <Button variant="ghost" size="sm" asChild className="text-sm">
                  <Link href="/recommendations">
                    View All
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedTopics.map((topic) => (
                  <Link key={topic.id} href={`/subjects/${topic.subjectSlug}/topics/${topic.id}`} className="group">
                    <div className="relative overflow-hidden rounded-lg bg-secondary/50 border border-secondary hover:border-primary/50 p-4 h-full transition-all duration-300">
                      <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/20 text-green-500">
                            {topic.level}
                          </span>
                          <span className="text-xs text-muted-foreground">Ages {topic.ageRange}</span>
                        </div>
                        <h3 className="font-medium group-hover:text-primary transition-colors">{topic.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{topic.subject}</p>
                        <div className="mt-auto text-xs text-muted-foreground">{topic.questionsCount} questions</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

