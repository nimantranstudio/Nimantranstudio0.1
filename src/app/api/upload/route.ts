import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize file name and create a unique name
        const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
        const uniqueName = `${Date.now()}-${originalName}`;
        
        // Define upload directory
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        
        // Ensure upload directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore error if directory already exists
        }

        // Save the file
        const path = join(uploadDir, uniqueName);
        await writeFile(path, buffer);

        // Return the public URL
        const publicUrl = `/uploads/${uniqueName}`;

        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
