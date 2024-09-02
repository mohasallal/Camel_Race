import { NextResponse } from "next/server";

export async function POST() {
  localStorage.removeItem("authToken");
  return NextResponse.json(
    { message: "Signed out successfully" },
    { status: 200 }
  );
}
