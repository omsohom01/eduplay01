import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("auth_session")?.value

  if (!sessionCookie) {
    return NextResponse.json({ user: null })
  }

  try {
    const session = JSON.parse(sessionCookie)
    return NextResponse.json({ user: session })
  } catch (error) {
    console.error("Session parsing error:", error)
    return NextResponse.json({ user: null })
  }
}
