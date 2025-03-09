"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, BookOpen, BarChart3, Info, LogIn, Gamepad2 } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-purple-600 opacity-50 blur-[2px]"></div>
          </div>
          <span className="text-xl font-bold gradient-text from-primary to-purple-500">EduPlay</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link
            href="/subjects"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="h-4 w-4" />
            <span>Subjects</span>
          </Link>
          <Link
            href="/games"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <Gamepad2 className="h-4 w-4" />
            <span>Games</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <Info className="h-4 w-4" />
            <span>About</span>
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="gap-1.5">
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              <span>Log In</span>
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>

        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="text-foreground"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-md border-b animate-fade-in">
          <nav className="container flex flex-col py-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-muted/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/subjects"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-muted/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="h-4 w-4" />
              <span>Subjects</span>
            </Link>
            <Link
              href="/games"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-muted/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <Gamepad2 className="h-4 w-4" />
              <span>Games</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-muted/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-muted/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>
            <div className="flex flex-col gap-2 mt-2 px-4 pt-2 border-t">
              <Button asChild variant="outline" size="sm" className="justify-start">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Log In
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-to-r from-primary to-purple-600">
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

