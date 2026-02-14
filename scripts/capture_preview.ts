import { chromium } from 'playwright';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import fs from 'fs';

const PORT = 3000;
const URL = `http://localhost:${PORT}`;
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'previews');

async function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function startServer(): Promise<ChildProcess> {
  console.log('Starting server...');
  const server = spawn('npm', ['run', 'dev'], {
    stdio: 'pipe',
    shell: true,
    env: { ...process.env, PORT: PORT.toString() }
  });

  server.stdout?.on('data', (data) => {
    // console.log(`Server stdout: ${data}`); // Optional: pipe output
  });

  server.stderr?.on('data', (data) => {
    console.error(`Server stderr: ${data}`);
  });

  return server;
}

async function waitForServer(url: string, timeout = 60000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch (e) {
      // ignore
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return false;
}

async function capturePreview() {
  await ensureDir(OUTPUT_DIR);

  // check if server is already running
  let serverProcess: ChildProcess | null = null;
  const isRunning = await waitForServer(URL, 1000); // quick check

  if (!isRunning) {
      serverProcess = await startServer();
      const ready = await waitForServer(URL);
      if (!ready) {
        console.error('Server failed to start');
        if (serverProcess) {
            serverProcess.kill();
        }
        process.exit(1);
      }
  } else {
      console.log('Server already running.');
  }

  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log(`Navigating to ${URL}...`);
    // 'networkidle' can be flaky with Next.js HMR/dev server connections.
    // Using 'domcontentloaded' and a small delay is more reliable for previews.
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000); // Give it a moment for hydration/rendering

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `preview_${timestamp}.png`;
    const filepath = path.join(OUTPUT_DIR, filename);

    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`Preview saved to: ${filepath}`);

  } catch (error) {
    console.error('Error capturing preview:', error);
  } finally {
    await browser.close();
    if (serverProcess) {
        console.log('Stopping server...');
        serverProcess.kill();
        // Give it a moment to shutdown
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

capturePreview();
