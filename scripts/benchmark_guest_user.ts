
// Mock Prisma Client
const mockPrisma = {
    user: {
        findUnique: async ({ where }: any) => {
            // Simulate DB latency
            await new Promise(resolve => setTimeout(resolve, 10));
            if (where.email === 'guest@nimantranstudio.com') {
                // In unoptimized, we simulate finding the user if it was created
                // But simplified: always return null first time, then return user
                return null; // For simplicity in simulation, assume we always search and maybe find or not.
                             // Actually, to simulate repeated calls:
                             // First call: not found -> create.
                             // Subsequent calls: found.
            }
            return null;
        },
        create: async ({ data }: any) => {
            await new Promise(resolve => setTimeout(resolve, 10));
            return {
                id: 'guest-user-id-123',
                email: data.email,
                name: data.name
            };
        }
    }
};

// We need a stateful mock for findUnique to behave correctly (find after create)
let dbUser: any = null;

const statefulMockPrisma = {
    user: {
        findUnique: async ({ where }: any) => {
            await new Promise(resolve => setTimeout(resolve, 10)); // 10ms latency
            if (where.email === 'guest@nimantranstudio.com') {
                return dbUser;
            }
            return null;
        },
        create: async ({ data }: any) => {
            await new Promise(resolve => setTimeout(resolve, 10)); // 10ms latency
            dbUser = {
                id: 'guest-user-id-123',
                email: data.email,
                name: data.name
            };
            return dbUser;
        }
    }
};


// Replicating the logic from src/app/api/wedding/route.ts
async function getOrCreateGuestUserUnoptimized() {
    const guestEmail = 'guest@nimantranstudio.com';
    let user = await statefulMockPrisma.user.findUnique({ where: { email: guestEmail } });
    if (!user) {
        user = await statefulMockPrisma.user.create({
            data: {
                email: guestEmail,
                name: 'Guest User',
                mobileNumber: '0000000000'
            }
        });
    }
    return user.id;
}

// Optimized version with caching
let cachedGuestUserId: string | null = null;

async function getOrCreateGuestUserOptimized() {
    if (cachedGuestUserId) return cachedGuestUserId;

    const guestEmail = 'guest@nimantranstudio.com';
    let user = await statefulMockPrisma.user.findUnique({ where: { email: guestEmail } });
    if (!user) {
        user = await statefulMockPrisma.user.create({
            data: {
                email: guestEmail,
                name: 'Guest User',
                mobileNumber: '0000000000'
            }
        });
    }
    cachedGuestUserId = user.id;
    return user.id;
}

async function runBenchmark() {
    console.log('Starting Benchmark (Simulated DB)...');

    const ITERATIONS = 100;

    // Reset DB state
    dbUser = null;
    cachedGuestUserId = null;

    // Warm up / Ensure user exists for Unoptimized run?
    // Actually, in real world, the user exists after first call.
    // So unoptimized will hit findUnique every time (1 DB call).
    // Optimized will hit cache (0 DB calls).

    // Let's run Unoptimized first.
    console.log(`Running Unoptimized version (${ITERATIONS} iterations)...`);
    const startUnoptimized = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
        await getOrCreateGuestUserUnoptimized();
    }
    const endUnoptimized = performance.now();
    const timeUnoptimized = endUnoptimized - startUnoptimized;
    console.log(`Unoptimized Time: ${timeUnoptimized.toFixed(2)}ms`);
    console.log(`Average per call: ${(timeUnoptimized / ITERATIONS).toFixed(2)}ms`);

    // Reset Cache (DB user remains)
    cachedGuestUserId = null;

    // Benchmark Optimized
    console.log(`Running Optimized version (${ITERATIONS} iterations)...`);
    const startOptimized = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
        await getOrCreateGuestUserOptimized();
    }
    const endOptimized = performance.now();
    const timeOptimized = endOptimized - startOptimized;
    console.log(`Optimized Time: ${timeOptimized.toFixed(2)}ms`);
    console.log(`Average per call: ${(timeOptimized / ITERATIONS).toFixed(2)}ms`);

    // Calculate improvement
    const improvement = timeUnoptimized / timeOptimized;
    console.log(`Speedup: ${improvement.toFixed(2)}x`);
}

runBenchmark().catch(console.error);
