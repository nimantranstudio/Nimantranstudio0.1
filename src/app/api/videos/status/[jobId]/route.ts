import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth-server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    // Ownership-checked via the job's order: outputUrl is a link to the
    // couple's finished invitation video, not something any caller holding a
    // job id should be able to read.
    const { user, error: authError } = await verifyAuth(req);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await params;
    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    const job = await prisma.videoRenderJob.findUnique({
      where: { id: jobId },
      include: { order: { select: { userId: true } } },
    });

    // Deliberately 404 rather than 403 — don't confirm a job id exists to a non-owner.
    if (!job || job.order?.userId !== user.id) {
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
