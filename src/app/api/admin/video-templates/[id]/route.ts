import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.videoTemplate.findUnique({
      where: { id: params.id },
      include: {
        themes: true,
        bundles: true,
      },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, template });
  } catch (error: any) {
    console.error("Failed to fetch template detail:", error);
    return NextResponse.json({ error: "Failed to fetch template detail" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, config } = body;

    const dataToUpdate: any = {};
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim() === "") {
        return NextResponse.json({ error: "Invalid template name" }, { status: 400 });
      }
      dataToUpdate.name = name.trim();
    }

    if (config !== undefined) {
      if (typeof config !== "object") {
        return NextResponse.json({ error: "Invalid configuration type" }, { status: 400 });
      }
      dataToUpdate.config = config;
    }

    const updated = await prisma.videoTemplate.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, template: updated });
  } catch (error: any) {
    console.error("Failed to update template:", error);
    return NextResponse.json({ error: error.message || "Failed to update template" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Unlink any Themes or Bundles linked to this template first to prevent DB errors
    await prisma.theme.updateMany({
      where: { videoTemplateId: params.id },
      data: { videoTemplateId: null },
    });

    await prisma.bundle.updateMany({
      where: { videoTemplateId: params.id },
      data: { videoTemplateId: null },
    });

    await prisma.videoTemplate.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Template deleted successfully" });
  } catch (error: any) {
    console.error("Failed to delete template:", error);
    return NextResponse.json({ error: error.message || "Failed to delete template" }, { status: 500 });
  }
}
