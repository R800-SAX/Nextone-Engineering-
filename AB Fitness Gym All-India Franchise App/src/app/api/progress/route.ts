import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "nextauthsecret321" });
    if (!token) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const progress = await db.progressEntry.findMany({
      where: { userId: token.id },
      orderBy: { date: "asc" } // Chronological order for chart plotting
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("GET progress error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "nextauthsecret321" });
    if (!token) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { weight, bodyFat, chest, waist, hips, biceps, thighs, notes, date } = body;

    const parsedDate = date ? new Date(date) : new Date();
    if (isNaN(parsedDate.getTime()) || parsedDate.getFullYear() > 2100 || parsedDate.getFullYear() < 1900) {
      return NextResponse.json({ message: "Invalid log date" }, { status: 400 });
    }

    const progress = await db.progressEntry.create({
      data: {
        userId: token.id,
        weight: weight ? parseFloat(weight) : null,
        bodyFat: bodyFat ? parseFloat(bodyFat) : null,
        chest: chest ? parseFloat(chest) : null,
        waist: waist ? parseFloat(waist) : null,
        hips: hips ? parseFloat(hips) : null,
        biceps: biceps ? parseFloat(biceps) : null,
        thighs: thighs ? parseFloat(thighs) : null,
        notes,
        date: parsedDate
      }
    });

    return NextResponse.json(progress, { status: 201 });
  } catch (error) {
    console.error("POST progress error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "nextauthsecret321" });
    if (!token) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const entry = await db.progressEntry.findUnique({
      where: { id }
    });

    if (!entry || entry.userId !== token.id) {
      return NextResponse.json({ message: "Entry not found" }, { status: 404 });
    }

    await db.progressEntry.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error("DELETE progress error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
