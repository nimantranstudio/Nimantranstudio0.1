import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const settings = await prisma.siteSetting.findMany();
        const settingsMap: Record<string, any> = {};
        settings.forEach(s => {
            try {
                settingsMap[s.key] = JSON.parse(s.value);
            } catch(e) {
                settingsMap[s.key] = s.value; // fallback
            }
        });
        return NextResponse.json({ success: true, settings: settingsMap });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const authResult = await verifyAuth(req);
        if (!authResult.success) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }
        
        const body = await req.json();
        const { key, value } = body;
        
        if (!key || value === undefined) {
            return NextResponse.json({ success: false, error: 'Key and value required' }, { status: 400 });
        }
        
        const valueStr = JSON.stringify(value);
        
        const updatedSetting = await prisma.siteSetting.upsert({
            where: { key },
            update: { value: valueStr },
            create: { key, value: valueStr },
        });
        
        return NextResponse.json({ success: true, setting: updatedSetting });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
