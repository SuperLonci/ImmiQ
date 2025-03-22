import {PrismaClient} from '@prisma/client';
import type {RequestEvent} from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function GET({params}: RequestEvent) {
    const {id} = params as { id: string };
    try {
        const building = await prisma.building.findUnique({
            where: {id},
            include: {
                apartments: true, // Include related apartments
                meters: true, // Include related meters
                costs: true,
            },
        });
        if (building) {
            return new Response(JSON.stringify(building), {
                headers: {'Content-Type': 'application/json'},
            });
        } else {
            return new Response(JSON.stringify({error: 'building not found'}), {
                status: 404,
                headers: {'Content-Type': 'application/json'},
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({error: 'Failed to fetch building details'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
}