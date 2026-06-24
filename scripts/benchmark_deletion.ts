import { writeFile, unlink, mkdir, rmdir } from 'fs/promises';
import path from 'path';

const TEST_DIR = path.join(process.cwd(), 'benchmark_temp');
const FILE_COUNT = 100;

async function setup() {
    await mkdir(TEST_DIR, { recursive: true });
    const files = [];
    for (let i = 0; i < FILE_COUNT; i++) {
        const filePath = path.join(TEST_DIR, `file_${i}.txt`);
        await writeFile(filePath, 'test content');
        files.push(filePath);
    }
    return files;
}

async function cleanup() {
    try {
        await rmdir(TEST_DIR, { recursive: true });
    } catch (e) {}
}

async function benchmarkSequential(files: string[]) {
    const start = performance.now();
    for (const file of files) {
        await unlink(file);
    }
    const end = performance.now();
    return end - start;
}

async function benchmarkParallel(files: string[]) {
    const start = performance.now();
    await Promise.all(files.map(async (file) => {
        try {
             await unlink(file);
        } catch (e) {
            console.error(e);
        }
    }));
    const end = performance.now();
    return end - start;
}

async function run() {
    console.log(`Setting up ${FILE_COUNT} files...`);

    // Sequential
    let files = await setup();
    console.log('Running sequential deletion...');
    const seqTime = await benchmarkSequential(files);
    console.log(`Sequential time: ${seqTime.toFixed(2)}ms`);

    // Parallel
    files = await setup();
    console.log('Running parallel deletion...');
    const parTime = await benchmarkParallel(files);
    console.log(`Parallel time: ${parTime.toFixed(2)}ms`);

    const improvement = ((seqTime - parTime) / seqTime) * 100;
    console.log(`Improvement: ${improvement.toFixed(2)}%`);

    await cleanup();
}

run().catch(console.error);
