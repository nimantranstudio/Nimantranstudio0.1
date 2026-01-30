import { writeFile, mkdir, rm } from 'fs/promises';
import path from 'path';
import { performance } from 'perf_hooks';

async function benchmark() {
    const TEMP_DIR = path.join(process.cwd(), 'temp_benchmark_uploads');

    // Ensure clean state
    await rm(TEMP_DIR, { recursive: true, force: true });
    await mkdir(TEMP_DIR, { recursive: true });

    // Create dummy files
    const FILE_COUNT = 200;
    const FILE_SIZE = 100 * 1024; // 100KB per file to minimize disk spam but enough to measure
    const formData = new FormData();

    console.log(`Preparing ${FILE_COUNT} files of size ${FILE_SIZE} bytes...`);
    for (let i = 0; i < FILE_COUNT; i++) {
        const buffer = new Uint8Array(FILE_SIZE);
        const file = new File([buffer], `test_image_${i}.png`, { type: 'image/png' });
        formData.append(`itemFile_item${i}`, file);
    }

    // --- Sequential (Baseline) ---
    console.log('Running Sequential Benchmark...');
    const startSeq = performance.now();

    const itemImagesSeq: { [key: string]: string } = {};
    for (const [key, value] of Array.from(formData.entries())) {
        if (key.startsWith('itemFile_') && value instanceof File) {
            const itemName = key.replace('itemFile_', '');
            const bytes = await value.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = `item-${itemName.replace(/\s+/g, '_')}-${uniqueSuffix}${path.extname(value.name)}`;
            const filepath = path.join(TEMP_DIR, filename);
            await writeFile(filepath, buffer);
            itemImagesSeq[itemName] = `/Image/bundle/${filename}`;
        }
    }
    const endSeq = performance.now();
    const timeSeq = endSeq - startSeq;
    console.log(`Sequential time: ${timeSeq.toFixed(2)}ms`);

    // Cleanup for next run
    await rm(TEMP_DIR, { recursive: true, force: true });
    await mkdir(TEMP_DIR, { recursive: true });

    // --- Parallel (Optimized) ---
    console.log('Running Parallel Benchmark...');
    const startPar = performance.now();

    const itemImagesPar: { [key: string]: string } = {};
    const promises = Array.from(formData.entries()).map(async ([key, value]) => {
         if (key.startsWith('itemFile_') && value instanceof File) {
            const itemName = key.replace('itemFile_', '');
            const bytes = await value.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = `item-${itemName.replace(/\s+/g, '_')}-${uniqueSuffix}${path.extname(value.name)}`;
            const filepath = path.join(TEMP_DIR, filename);
            await writeFile(filepath, buffer);
            itemImagesPar[itemName] = `/Image/bundle/${filename}`;
        }
    });

    await Promise.all(promises);

    const endPar = performance.now();
    const timePar = endPar - startPar;
    console.log(`Parallel time: ${timePar.toFixed(2)}ms`);

    console.log(`Improvement: ${(timeSeq / timePar).toFixed(2)}x faster`);

    // Final Cleanup
    await rm(TEMP_DIR, { recursive: true, force: true });
}

benchmark().catch(console.error);
