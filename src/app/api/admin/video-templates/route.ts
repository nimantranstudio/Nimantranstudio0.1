import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Validate structure of uploaded video template JSON config
function validateTemplateConfig(config: any): string | null {
  if (!config) return "JSON configuration is empty";
  if (typeof config !== "object") return "Configuration must be a JSON object";
  if (typeof config.width !== "number" || config.width <= 0) return "Missing or invalid 'width' (must be positive number)";
  if (typeof config.height !== "number" || config.height <= 0) return "Missing or invalid 'height' (must be positive number)";
  if (typeof config.fps !== "number" || config.fps <= 0) return "Missing or invalid 'fps' (must be positive number)";
  if (!Array.isArray(config.scenes) || config.scenes.length === 0) return "Configuration must contain a non-empty 'scenes' array";

  for (let s = 0; s < config.scenes.length; s++) {
    const scene = config.scenes[s];
    if (typeof scene.durationInFrames !== "number" || scene.durationInFrames <= 0) {
      return `Scene at index ${s} is missing or has invalid 'durationInFrames' (must be positive number)`;
    }
    if (!Array.isArray(scene.layers) || scene.layers.length === 0) {
      return `Scene at index ${s} must contain a non-empty 'layers' array`;
    }

    for (let l = 0; l < scene.layers.length; l++) {
      const layer = scene.layers[l];
      if (!layer.type || !["background", "text", "image", "video", "audio"].includes(layer.type)) {
        return `Layer at index ${l} in Scene ${s} has invalid type: must be 'background', 'text', 'image', 'video', or 'audio'`;
      }
      if (typeof layer.value !== "string") {
        return `Layer at index ${l} in Scene ${s} is missing 'value' (must be string)`;
      }
    }
  }

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const templates = await prisma.videoTemplate.findMany({
      include: {
        themes: { select: { id: true, name: true } },
        bundles: { select: { id: true, BundleName: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, templates });
  } catch (error: any) {
    console.error("Failed to fetch video templates:", error);
    return NextResponse.json({ error: "Failed to fetch video templates" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, config } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Missing or invalid template name" }, { status: 400 });
    }

    const validationError = validateTemplateConfig(config);
    if (validationError) {
      return NextResponse.json({ error: `Invalid JSON structure: ${validationError}` }, { status: 400 });
    }

    const template = await prisma.videoTemplate.create({
      data: {
        name: name.trim(),
        config: config,
      },
    });

    return NextResponse.json({ success: true, template });
  } catch (error: any) {
    console.error("Failed to create video template:", error);
    return NextResponse.json({ error: error.message || "Failed to create video template" }, { status: 500 });
  }
}
