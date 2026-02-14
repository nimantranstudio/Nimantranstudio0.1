import { writeFile, mkdir, rm } from 'fs/promises';
import path from 'path';

const TEMP_DIR = path.join(process.cwd(), 'temp_benchmark_uploads');

function createDummyFiles(count: number, sizeBytes: number): File[] {
    const files: File[] = [];
    const buffer = Buffer.alloc(sizeBytes, 'a');
    for (let i = 0; i < count; i++) {
        files.push(new File([buffer], `test-file-${i}.txt`, { type: 'text/plain' }));
    }
    return files;
}

async function runSequential(files: File[]) {
    const uploadDir = path.join(TEMP_DIR, 'sequential');
    await mkdir(uploadDir, { recursive: true });

    const start = performance.now();
    for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = file.name;
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
    }
    const end = performance.now();
    return end - start;
}

async function runParallel(files: File[]) {
    const uploadDir = path.join(TEMP_DIR, 'parallel');
    await mkdir(uploadDir, { recursive: true });

    const start = performance.now();
    await Promise.all(files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = file.name;
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
    }));
    const end = performance.now();
    return end - start;
}

async function main() {
    try {
        console.log('Starting benchmark...');

        // Setup
        await rm(TEMP_DIR, { recursive: true, force: true });

        const fileCount = 100;
        const fileSize = 1024 * 10; // 10KB
        console.log(`Generating ${fileCount} files of ${fileSize / 1024}KB each...`);

        const files = createDummyFiles(fileCount, fileSize);

        // Run Parallel First
        console.log('Running parallel upload...');
        const parallelTime = await runParallel(files);
        console.log(`Parallel time: ${parallelTime.toFixed(2)}ms`);

        // Run Sequential Second
        console.log('Running sequential upload...');
        const sequentialTime = await runSequential(files);
        console.log(`Sequential time: ${sequentialTime.toFixed(2)}ms`);

        // Results
        const improvement = sequentialTime - parallelTime;
        const improvementPercent = (improvement / sequentialTime) * 100;

        console.log('--- Results ---');
        console.log(`Sequential: ${sequentialTime.toFixed(2)}ms`);
        console.log(`Parallel:   ${parallelTime.toFixed(2)}ms`);
        console.log(`Improvement: ${improvement.toFixed(2)}ms (${improvementPercent.toFixed(2)}%)`);

        // Cleanup
        await rm(TEMP_DIR, { recursive: true, force: true });

    } catch (error) {
        console.error('Benchmark failed:', error);
    }
}

main();
