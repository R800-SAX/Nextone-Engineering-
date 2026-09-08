import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "nextauthsecret321" });
    if (!token) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const goals = await db.fitnessGoal.findMany({
      where: { userId: token.id },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("GET goals error:", error);
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
    const { type, title, target, current, unit, deadline } = body;

    if (!type || !title || target === undefined || current === undefined || !unit || !deadline) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const parsedDate = new Date(deadline);
    if (isNaN(parsedDate.getTime()) || parsedDate.getFullYear() > 2100 || parsedDate.getFullYear() < 1900) {
      return NextResponse.json({ message: "Invalid deadline date" }, { status: 400 });
    }

    const goal = await db.fitnessGoal.create({
      data: {
        userId: token.id,
        type,
        title,
        target: parseFloat(target),
        current: parseFloat(current),
        unit,
        deadline: parsedDate,
        status: "ACTIVE"
      }
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("POST goals error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "nextauthsecret321" });
    if (!token) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { id, current, status } = body;

    if (!id) {
      return NextResponse.json({ message: "Goal ID is required" }, { status: 400 });
    }

    const existingGoal = await db.fitnessGoal.findUnique({
      where: { id }
    });

    if (!existingGoal || existingGoal.userId !== token.id) {
      return NextResponse.json({ message: "Goal not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (current !== undefined) updateData.current = parseFloat(current);
    if (status !== undefined) updateData.status = status;

    const updatedGoal = await db.fitnessGoal.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error("PUT goals error:", error);
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
      return NextResponse.json({ message: "Goal ID is required" }, { status: 400 });
    }

    const existingGoal = await db.fitnessGoal.findUnique({
      where: { id }
    });

    if (!existingGoal || existingGoal.userId !== token.id) {
      return NextResponse.json({ message: "Goal not found" }, { status: 404 });
    }

    await db.fitnessGoal.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("DELETE goals error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
