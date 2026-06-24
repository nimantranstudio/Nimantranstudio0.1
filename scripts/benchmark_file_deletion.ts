import { writeFile, unlink, mkdir, rmdir, readdir, rm } from 'fs/promises';
import path from 'path';
import { performance } from 'perf_hooks';

const TEMP_DIR = path.join(process.cwd(), 'public/temp_benchmark');
const FILE_COUNT = 200;

async function setup() {
    try {
        await rm(TEMP_DIR, { recursive: true, force: true });
        await mkdir(TEMP_DIR, { recursive: true });
    } catch (e) {
        console.error("Setup error", e);
    }
}

async function cleanup() {
    try {
        await rm(TEMP_DIR, { recursive: true, force: true });
    } catch (e) {
        console.error('Cleanup failed:', e);
    }
}

async function createFiles(count: number): Promise<string[]> {
    const files: string[] = [];
    for (let i = 0; i < count; i++) {
        const filename = `file_${i}.txt`;
        const filepath = path.join(TEMP_DIR, filename);
        await writeFile(filepath, 'dummy content');
        files.push(filepath);
    }
    return files;
}

async function measureSequential(files: string[]) {
    const start = performance.now();
    for (const file of files) {
        try {
            await unlink(file);
        } catch (e) {
            console.error(`Failed to delete ${file}`, e);
        }
    }
    const end = performance.now();
    return end - start;
}

async function measureParallel(files: string[]) {
    const start = performance.now();
    await Promise.all(files.map(async (file) => {
        try {
            await unlink(file);
        } catch (e) {
            console.error(`Failed to delete ${file}`, e);
        }
    }));
    const end = performance.now();
    return end - start;
}

async function runBenchmark() {
    console.log(`Running benchmark with ${FILE_COUNT} files...`);
    await setup();

    // Measure Sequential
    console.log('Creating files for sequential deletion...');
    const filesSeq = await createFiles(FILE_COUNT);
    console.log('Measuring sequential deletion...');
    const timeSeq = await measureSequential(filesSeq);
    console.log(`Sequential deletion took: ${timeSeq.toFixed(2)}ms`);

    // Measure Parallel
    console.log('Creating files for parallel deletion...');
    const filesPar = await createFiles(FILE_COUNT);
    console.log('Measuring parallel deletion...');
    const timePar = await measureParallel(filesPar);
    console.log(`Parallel deletion took: ${timePar.toFixed(2)}ms`);

    const improvement = ((timeSeq - timePar) / timeSeq) * 100;
    console.log(`Improvement: ${improvement.toFixed(2)}%`);

    await cleanup();
}

runBenchmark().catch(console.error);
