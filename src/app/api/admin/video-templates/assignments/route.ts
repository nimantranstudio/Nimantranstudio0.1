import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Fetch all themes and bundles with their assigned templates
    const themes = await prisma.theme.findMany({
      include: { videoTemplate: true },
      orderBy: { name: "asc" },
    });

    const bundles = await prisma.bundle.findMany({
      include: { videoTemplate: true, themeRef: true },
      orderBy: { BundleName: "asc" },
    });

    return NextResponse.json({ success: true, themes, bundles });
  } catch (error: any) {
    console.error("Failed to fetch template assignments:", error);
    return NextResponse.json({ error: "Failed to fetch template assignments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { targetType, targetId, videoTemplateId } = await req.json();

    if (!targetType || !["theme", "bundle"].includes(targetType)) {
      return NextResponse.json({ error: "Invalid targetType: must be 'theme' or 'bundle'" }, { status: 400 });
    }

    if (!targetId) {
      return NextResponse.json({ error: "Missing targetId" }, { status: 400 });
    }

    // Verify videoTemplateId exists if specified
    if (videoTemplateId) {
      const templateExists = await prisma.videoTemplate.findUnique({
        where: { id: videoTemplateId },
      });
      if (!templateExists) {
        return NextResponse.json({ error: "Specified VideoTemplate not found" }, { status: 400 });
      }
    }

    if (targetType === "theme") {
      await prisma.theme.update({
        where: { id: targetId },
        data: { videoTemplateId: videoTemplateId || null },
      });
    } else {
      await prisma.bundle.update({
        where: { id: targetId },
        data: { videoTemplateId: videoTemplateId || null },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated video template assignment for ${targetType}`,
    });
  } catch (error: any) {
    console.error("Failed to assign template:", error);
    return NextResponse.json({ error: error.message || "Failed to update assignment" }, { status: 500 });
  }
}
