import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { eventId: string; loopId: string } }
) {
  const { searchParams } = new URL(req.url);
  const { loopId } = params;
  const userId = searchParams.get("userId");

  try {
    let registeredCamels;

    if (userId) {
      registeredCamels = await db.camelLoop.findMany({
        where: {
          loopId: String(loopId),
          camel: {
            ownerId: String(userId),
          },
        },
        include: {
          camel: {
            include: {
              owner: {
                select: {
                  FirstName: true,
                  FatherName: true,
                  GrandFatherName: true,
                  FamilyName: true,
                },
              },
            },
          },
        },
      });
    } else {
      registeredCamels = await db.camelLoop.findMany({
        where: {
          loopId: String(loopId),
        },
        include: {
          camel: {
            include: {
              owner: {
                select: {
                  FirstName: true,
                  FatherName: true,
                  GrandFatherName: true,
                  FamilyName: true,
                },
              },
            },
          },
        },
      });
    }

    const camels = registeredCamels.map((camelLoop) => ({
      id: camelLoop.camel.id,
      name: camelLoop.camel.name,
      age: camelLoop.camel.age,
      sex: camelLoop.camel.sex,
      owner: `${camelLoop.camel.owner.FirstName} ${camelLoop.camel.owner.FatherName} ${camelLoop.camel.owner.GrandFatherName} ${camelLoop.camel.owner.FamilyName}`,
    }));

    return NextResponse.json(camels);
  } catch (error) {
    console.error("Error fetching registered camels:", error);
    return NextResponse.json(
      { error: "Error fetching registered camels" },
      { status: 500 }
    );
  }
}
