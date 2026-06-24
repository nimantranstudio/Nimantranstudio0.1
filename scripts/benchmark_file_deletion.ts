import fs from 'fs/promises';
import path from 'path';
import { performance } from 'perf_hooks';

async function benchmark() {
    const tempDir = path.join(process.cwd(), 'temp_benchmark');
    const numFiles = 100;

    // Create temp directory
    try {
        await fs.mkdir(tempDir, { recursive: true });
    } catch (e) {
        // Ignore if exists
    }

    console.log(`Creating ${numFiles} dummy files...`);

    // Helper to create dummy files
    const createFiles = async () => {
        for (let i = 0; i < numFiles; i++) {
            await fs.writeFile(path.join(tempDir, `file_${i}.txt`), 'dummy content');
        }
    };

    // 1. Measure Sequential
    await createFiles();
    const filesSeq = await fs.readdir(tempDir);
    const fullPathsSeq = filesSeq.map(f => path.join(tempDir, f));

    const startSeq = performance.now();
    for (const fullPath of fullPathsSeq) {
        await fs.unlink(fullPath);
    }
    const endSeq = performance.now();
    const durationSeq = endSeq - startSeq;
    console.log(`Sequential deletion time: ${durationSeq.toFixed(2)}ms`);

    // 2. Measure Parallel
    await createFiles();
    const filesPar = await fs.readdir(tempDir);
    const fullPathsPar = filesPar.map(f => path.join(tempDir, f));

    const startPar = performance.now();
    await Promise.all(fullPathsPar.map(fullPath => fs.unlink(fullPath)));
    const endPar = performance.now();
    const durationPar = endPar - startPar;
    console.log(`Parallel deletion time: ${durationPar.toFixed(2)}ms`);

    const improvement = ((durationSeq - durationPar) / durationSeq) * 100;
    console.log(`Improvement: ${improvement.toFixed(2)}%`);

    // Cleanup
    try {
        await fs.rmdir(tempDir);
    } catch (e) {
        // Ignore
    }
}

benchmark().catch(console.error);
