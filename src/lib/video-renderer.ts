import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs";

// Load self-contained ffmpeg binary path
let ffmpegPath: string | undefined = undefined;
try {
  const ffmpeg = require("@ffmpeg-installer/ffmpeg");
  ffmpegPath = ffmpeg.path;
  console.log("Using self-contained ffmpeg binary at:", ffmpegPath);
} catch (e) {
  console.warn("Could not find self-contained ffmpeg installer, falling back to system path.");
}

/**
 * Renders a Remotion video job on the server.
 */
export async function startVideoRender(jobId: string): Promise<void> {
  console.log(`Starting video render for job: ${jobId}`);
  
  // Set job status to RENDERING in database
  await prisma.videoRenderJob.update({
    where: { id: jobId },
    data: { status: "RENDERING", progress: 0 },
  });

  try {
    const job = await prisma.videoRenderJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new Error(`Job ${jobId} not found in database.`);
    }

    // Determine output directory
    const outputDir = path.join(process.cwd(), "public", "videos");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputFilename = `video_${jobId}.mp4`;
    const outputPath = path.join(outputDir, outputFilename);

    console.log("Bundling Remotion code...");
    // 1. Bundle the Remotion entry point
    const entryPoint = path.join(process.cwd(), "remotion-templates", "index.tsx");
    const bundleLocation = await bundle({
      entryPoint,
      // Suppress too much build output logging
      logLevel: "error",
    });

    console.log("Selecting composition:", job.compositionId);
    const comp = await selectComposition({
      bundle: bundleLocation,
      id: job.compositionId,
      inputProps: (job.inputProps as any) || {},
    });

    // Dynamically adjust composition duration based on the sum of scene frames in the JSON configuration
    if (job.compositionId === "DynamicVideo" && job.inputProps) {
      try {
        const inputPropsObj = job.inputProps as any;
        const config = inputPropsObj.templateConfig;
        if (config && Array.isArray(config.scenes)) {
          const totalFrames = config.scenes.reduce((sum: number, scene: any) => sum + (scene.durationInFrames || 0), 0);
          if (totalFrames > 0) {
            console.log(`Overriding composition duration to ${totalFrames} frames based on template config.`);
            comp.durationInFrames = totalFrames;
          }
        }
      } catch (err) {
        console.error("Error calculating dynamic video duration:", err);
      }
    }

    console.log(`Beginning rendering (${comp.durationInFrames} frames)...`);
    // 3. Render the media to MP4 using Puppeteer + ffmpeg
    await renderMedia({
      bundle: bundleLocation,
      composition: comp,
      outputLocation: outputPath,
      codec: "h264",
      ffmpegExecutable: ffmpegPath, // Use portable ffmpeg
      inputProps: (job.inputProps as any) || {},
      onProgress: async ({ progress }) => {
        const percentage = Math.round(progress * 100);
        console.log(`Job ${jobId} Render Progress: ${percentage}%`);
        try {
          await prisma.videoRenderJob.update({
            where: { id: jobId },
            data: { progress: percentage },
          });
        } catch (e) {
          // Ignore transient DB lock / write conflict errors during render progress update
        }
      },
    });

    console.log(`Render complete! Saved to ${outputPath}`);
    
    // Update DB status to DONE
    await prisma.videoRenderJob.update({
      where: { id: jobId },
      data: {
        status: "DONE",
        progress: 100,
        outputUrl: `/videos/${outputFilename}`,
      },
    });

  } catch (error: any) {
    console.error(`Render failed for job ${jobId}:`, error);
    await prisma.videoRenderJob.update({
      where: { id: jobId },
      data: {
        status: "FAILED",
        error: error.message || "Unknown error during rendering",
      },
    });
  }
}
