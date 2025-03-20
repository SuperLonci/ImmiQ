import {PrismaClient} from '@prisma/client';
import type {RequestEvent} from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function GET(event: RequestEvent) {
    try {
        const costs = await prisma.cost.findMany({
            include: {}
        });
        return new Response(JSON.stringify(costs), {
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        return new Response(JSON.stringify({error: 'Failed to fetch costs'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
}