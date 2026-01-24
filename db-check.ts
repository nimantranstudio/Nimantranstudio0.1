import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';

const prisma = new PrismaClient({
    log: ['info', 'warn', 'error'],
});

async function main() {
    try {
        console.log('Attempting to connect to database...');
        console.log('URL:', process.env.DATABASE_URL);

        await prisma.$connect();

        console.log('Connection SUCCESSFUL!');
        await writeFile('db-check.log', 'Connection SUCCESSFUL!\nUsing URL: ' + process.env.DATABASE_URL);

        // Try to CREATE a theme
        try {
            const newTheme = await prisma.theme.create({
                data: {
                    name: 'Test Theme CLI ' + Date.now(),
                    description: 'Created via db-check script',
                    isActive: true
                }
            });
            console.log('Successfully CREATED theme with ID:', newTheme.id);
            await writeFile('db-check.log', `\nCREATE SUCCESS: Theme ID ${newTheme.id}`, { flag: 'a' });
        } catch (createError: any) {
            console.error('CREATE FAILED:', createError);
            await writeFile('db-check.log', `\nCREATE FAILED: ${createError.message}`, { flag: 'a' });
            throw createError;
        }

        // Try a simple query
        const count = await prisma.theme.count();
        console.log(`Theme count: ${count}`);
        await writeFile('db-check.log', `\nFinal Theme count: ${count}`, { flag: 'a' });

    } catch (e: any) {
        console.error('Connection FAILED:', e);
        const errorMsg = `Connection FAILED: ${e.message}\nCode: ${e.code}\nDetails: ${JSON.stringify(e)}`;
        await writeFile('db-check.log', errorMsg);
    } finally {
        await prisma.$disconnect();
    }
}

main();
