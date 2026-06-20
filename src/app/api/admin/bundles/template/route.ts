import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const { templateUrl, htmlContent } = await request.json();

        if (!templateUrl || !htmlContent) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // templateUrl is typically something like `/Image/bundle/template-xxx.html`
        const filename = path.basename(templateUrl);
        const filepath = path.join(process.cwd(), 'public/Image/bundle', filename);

        await writeFile(filepath, htmlContent, 'utf8');

        return NextResponse.json({ success: true, message: 'Template updated successfully' });
    } catch (error: any) {
        console.error('Error updating template HTML:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
