import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = await params;
    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    const job = await prisma.videoRenderJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: job.status,
      progress: job.progress,
      outputUrl: job.outputUrl,
      error: job.error,
    });
  } catch (error: any) {
    console.error("Error retrieving video render job status:", error);
    return NextResponse.json({ error: error.message || "Failed to retrieve status" }, { status: 500 });
  }
}
