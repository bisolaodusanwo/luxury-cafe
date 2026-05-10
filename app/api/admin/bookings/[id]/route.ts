import { NextRequest, NextResponse } from "next/server"

const API = process.env.BACKEND_URL ?? "http://localhost:5000"

function forwardAuth(req: NextRequest) {
  const cookie = req.cookies.get("admin_token")?.value
  return cookie ? `Bearer ${cookie}` : ""
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const res = await fetch(`${API}/api/bookings/${id}`, {
      headers: { Authorization: forwardAuth(request) },
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: "Service unavailable." }, { status: 503 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const res = await fetch(`${API}/api/bookings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: forwardAuth(request),
      },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: "Service unavailable." }, { status: 503 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const res = await fetch(`${API}/api/bookings/${id}`, {
      method: "DELETE",
      headers: { Authorization: forwardAuth(request) },
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: "Service unavailable." }, { status: 503 })
  }
}
