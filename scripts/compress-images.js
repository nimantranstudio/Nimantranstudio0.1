const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MIN_SIZE_KB = 300; // only compress files larger than this

async function findImages(dir, results = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await findImages(full, results);
        } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
            const stat = fs.statSync(full);
            if (stat.size > MIN_SIZE_KB * 1024) {
                results.push({ path: full, size: stat.size });
            }
        }
    }
    return results;
}

async function compress(filePath, originalSize) {
    const ext = path.extname(filePath).toLowerCase();
    const tmp = filePath + '.tmp';

    try {
        if (ext === '.png') {
            await sharp(filePath)
                .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
                .toFile(tmp);
        } else {
            await sharp(filePath)
                .jpeg({ quality: 82, progressive: true, mozjpeg: true })
                .toFile(tmp);
        }

        const newSize = fs.statSync(tmp).size;
        if (newSize < originalSize) {
            fs.renameSync(tmp, filePath);
            const saved = ((originalSize - newSize) / 1024).toFixed(0);
            const pct = (((originalSize - newSize) / originalSize) * 100).toFixed(1);
            console.log(`✓ ${path.relative(PUBLIC_DIR, filePath).padEnd(70)} ${(originalSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB  (-${saved}KB, ${pct}%)`);
            return originalSize - newSize;
        } else {
            fs.unlinkSync(tmp);
            console.log(`- ${path.relative(PUBLIC_DIR, filePath)} (already optimal)`);
            return 0;
        }
    } catch (err) {
        if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
        console.error(`✗ ${filePath}: ${err.message}`);
        return 0;
    }
}

async function main() {
    console.log('Scanning for large images...\n');
    const images = await findImages(PUBLIC_DIR);
    images.sort((a, b) => b.size - a.size);

    console.log(`Found ${images.length} images over ${MIN_SIZE_KB}KB\n`);
    console.log('─'.repeat(90));

    let totalSaved = 0;
    for (const img of images) {
        totalSaved += await compress(img.path, img.size);
    }

    console.log('─'.repeat(90));
    console.log(`\nTotal saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(console.error);
