import {PrismaClient} from '@prisma/client';
import type {RequestEvent} from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function GET(event: RequestEvent) {
    try {
        const houses = await prisma.house.findMany({
            include: {units: true}, // Include related units
        });
        return new Response(JSON.stringify(houses), {
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        return new Response(JSON.stringify({error: 'Failed to fetch houses'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
}