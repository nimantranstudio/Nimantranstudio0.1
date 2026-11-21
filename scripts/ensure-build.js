/**
 * Runs before `npm start` (the "prestart" script).
 *
 * `next start` only serves a finished production build (.next/BUILD_ID). If
 * there is none — never built, a build failed or was interrupted — or the
 * source has changed since the last build, build first so `npm start` never
 * fails with "Could not find a production build" or serves stale code.
 *
 * Vercel runs `npm run build` itself and never calls `npm start`, so this only
 * affects local runs.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const buildId = path.join(root, '.next', 'BUILD_ID');
const watched = ['src', 'public', 'prisma/schema.prisma', 'package.json', 'next.config.ts', 'tsconfig.json'];

function newestChange(p) {
    let stat;
    try {
        stat = fs.statSync(p);
    } catch {
        return 0;
    }
    if (!stat.isDirectory()) return stat.mtimeMs;
    let newest = stat.mtimeMs;
    for (const entry of fs.readdirSync(p)) {
        newest = Math.max(newest, newestChange(path.join(p, entry)));
    }
    return newest;
}

let reason = null;
if (!fs.existsSync(buildId)) {
    reason = 'no production build found';
} else {
    const builtAt = fs.statSync(buildId).mtimeMs;
    const changedAt = Math.max(...watched.map((p) => newestChange(path.join(root, p))));
    if (changedAt > builtAt) reason = 'code changed since the last build';
}

if (!reason) {
    console.log('[prestart] Production build is up to date.');
    process.exit(0);
}

console.log(`[prestart] ${reason} — running "npm run build" first...`);
const result = spawnSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit', shell: true });
if (result.status !== 0) {
    console.error('[prestart] Build failed — fix the error above, then run "npm start" again.');
}
process.exit(result.status ?? 1);
