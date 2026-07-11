import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startVideoRender } from "@/lib/video-renderer";

export async function POST(req: NextRequest) {
  try {
    const { orderId, slide1Bg, slide2Bg, slide3Bg, slide4Bg, slide5Bg } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        bundle: {
          include: {
            themeRef: {
              include: {
                videoTemplate: true,
              },
            },
            videoTemplate: true,
            bundleItems: {
              include: {
                event: true,
              },
            },
          },
        },
        user: {
          include: {
            weddings: {
              include: {
                events: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Attempt to gather wedding details for input props
    const wedding = order.user.weddings[0]; // Fetch user's first registered wedding
    if (!wedding) {
      return NextResponse.json({ error: "No wedding details found for user to render video invite" }, { status: 400 });
    }

    const primaryEvent = wedding.events[0] || {
      name: "Wedding",
      date: "14th February 2026",
      time: "6:30 PM",
      venue: "Grand Palace Resort, Rajasthan, India",
    };

    // Determine if a video template is assigned to the bundle or the theme
    const assignedTemplate = order.bundle.videoTemplate || order.bundle.themeRef?.videoTemplate;

    let compositionId = "WeddingInvite";
    let inputProps: any = {};

    if (assignedTemplate) {
      compositionId = "DynamicVideo";
      inputProps = {
        templateConfig: assignedTemplate.config,
        userData: {
          groomName: wedding.groomName || "Rahul",
          brideName: wedding.brideName || "Anjali",
          eventDate: primaryEvent.date || "14th February 2026",
          eventTime: primaryEvent.time || "6:30 PM",
          venue: primaryEvent.venue || "Grand Palace Resort, Rajasthan, India",
          eventType: primaryEvent.name || "Wedding",
          themeColor: order.bundle.themeRef?.name?.toLowerCase().includes("haldi") ? "#D97706" : "#b38b40",
        },
      };
    } else {
      const getSlidePath = (typeKey: string, fallback: string) => {
        const bodyMap: Record<string, string | undefined> = {
          'SAVE_THE_DATE': slide1Bg,
          'HALDI': slide2Bg,
          'MEHENDI': slide3Bg,
          'SANGEET': slide4Bg,
          'WEDDING': slide5Bg,
        };
        if (bodyMap[typeKey]) return bodyMap[typeKey];

        const bundleItems = order.bundle.bundleItems || [];
        const item = bundleItems.find(bi => {
          const biType = (bi.eventType || bi.event?.eventName || '').toUpperCase().replace(/_/g, '');
          return biType.includes(typeKey.toUpperCase());
        });
        if (item?.templatePath) return item.templatePath;
        
        const previewImagesStr = order.bundle.previewImages || order.bundle.themeRef?.previewImages;
        if (previewImagesStr) {
          try {
            const displayImages = JSON.parse(previewImagesStr);
            const indexMap: Record<string, number> = {
              'SAVE_THE_DATE': 0,
              'HALDI': 1,
              'MEHENDI': 2,
              'SANGEET': 3,
              'WEDDING': 4,
            };
            const idx = indexMap[typeKey];
            if (idx !== undefined && displayImages[idx]) return displayImages[idx];
          } catch (e) {
            const displayImages = previewImagesStr.split(',').map((s: string) => s.trim());
            const indexMap: Record<string, number> = {
              'SAVE_THE_DATE': 0,
              'HALDI': 1,
              'MEHENDI': 2,
              'SANGEET': 3,
              'WEDDING': 4,
            };
            const idx = indexMap[typeKey];
            if (idx !== undefined && displayImages[idx]) return displayImages[idx];
          }
        }
        return fallback;
      };

      // Fallback to default Rajputana hardcoded teaser template
      compositionId = "WeddingInvite";
      inputProps = {
        groomName: wedding.groomName,
        brideName: wedding.brideName,
        eventDate: primaryEvent.date,
        eventTime: primaryEvent.time,
        venue: primaryEvent.venue,
        eventType: primaryEvent.name || "Wedding",
        themeColor: order.bundle.themeRef?.name?.toLowerCase().includes("haldi") ? "#D97706" : "#b38b40",
        musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        slide1Bg: getSlidePath('SAVE_THE_DATE', '/assets/themes/rajputana/save-the-date.png'),
        slide2Bg: getSlidePath('HALDI', '/assets/themes/rajputana/haldi-invite.png'),
        slide3Bg: getSlidePath('MEHENDI', '/assets/themes/rajputana/mehendi-invite.png'),
        slide4Bg: getSlidePath('SANGEET', '/assets/themes/rajputana/sangeet-invite.png'),
        slide5Bg: getSlidePath('WEDDING', '/assets/themes/rajputana/wedding-invite.png'),
      };
    }

    // Upsert the render job
    const job = await prisma.videoRenderJob.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        compositionId,
        inputProps,
      },
      update: {
        status: "PENDING",
        progress: 0,
        outputUrl: null,
        error: null,
        compositionId,
        inputProps,
      },
    });

    // Run the video render asynchronously (does not block this request)
    startVideoRender(job.id).catch((err) => {
      console.error(`Async video render failed launch for job ${job.id}:`, err);
    });

    return NextResponse.json({ success: true, jobId: job.id });
  } catch (error: any) {
    console.error("Error triggering video render:", error);
    return NextResponse.json({ error: error.message || "Failed to trigger video render" }, { status: 500 });
  }
}
