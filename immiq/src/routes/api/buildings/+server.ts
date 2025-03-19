import {PrismaClient} from '@prisma/client';
import type {RequestEvent} from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function GET(event: RequestEvent) {
    try {
        const buildings = await prisma.building.findMany({
            include: {apartments: true}, // Include related apartments
        });
        return new Response(JSON.stringify(buildings), {
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        return new Response(JSON.stringify({error: 'Failed to fetch buildings'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
}