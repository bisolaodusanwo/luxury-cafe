import { NextRequest, NextResponse } from "next/server"

const API = process.env.BACKEND_URL ?? "http://localhost:5000"

function forwardAuth(req: NextRequest) {
  const cookie = req.cookies.get("admin_token")?.value
  return cookie ? `Bearer ${cookie}` : ""
}

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(`${API}/api/bookings`, {
      headers: { Authorization: forwardAuth(request) },
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: "Service unavailable." }, { status: 503 })
  }
}
