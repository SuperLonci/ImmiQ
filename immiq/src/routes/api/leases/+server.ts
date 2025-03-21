import {PrismaClient} from '@prisma/client';
import type {RequestEvent} from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function GET(event: RequestEvent) {
    try {
        const leases = await prisma.lease.findMany({
            include: {
                apartment: {
                    select: {
                        name: true
                    }
                },
                tenant: {
                    select: {
                        name: true
                    }
                }
            }
        });
        return new Response(JSON.stringify(leases), {
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        return new Response(JSON.stringify({error: 'Failed to fetch leases'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
}