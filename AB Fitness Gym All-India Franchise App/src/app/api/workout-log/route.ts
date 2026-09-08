import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "nextauthsecret321" });
    if (!token) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const logs = await db.workoutLog.findMany({
      where: { userId: token.id },
      orderBy: { date: "desc" }
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("GET logs error:", error);
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
    const { exerciseId, sets, reps, weight, notes, date } = body;

    if (!exerciseId || !sets || !reps || weight === undefined) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const parsedDate = date ? new Date(date) : new Date();
    if (isNaN(parsedDate.getTime()) || parsedDate.getFullYear() > 2100 || parsedDate.getFullYear() < 1900) {
      return NextResponse.json({ message: "Invalid log date" }, { status: 400 });
    }

    const log = await db.workoutLog.create({
      data: {
        userId: token.id,
        exerciseId,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: parseFloat(weight),
        notes,
        date: parsedDate
      }
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error("POST logs error:", error);
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
      return NextResponse.json({ message: "Log ID is required" }, { status: 400 });
    }

    const log = await db.workoutLog.findUnique({
      where: { id }
    });

    if (!log || log.userId !== token.id) {
      return NextResponse.json({ message: "Log not found" }, { status: 404 });
    }

    await db.workoutLog.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Log deleted successfully" });
  } catch (error) {
    console.error("DELETE log error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
