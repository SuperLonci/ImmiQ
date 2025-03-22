import {PrismaClient} from '@prisma/client';
import type {RequestEvent} from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function GET({params}: RequestEvent) {
    const {id} = params as { id: string };
    try {
        const lease = await prisma.lease.findUnique({
            where: {id},
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
        if (lease) {
            return new Response(JSON.stringify(lease), {
                headers: {'Content-Type': 'application/json'},
            });
        } else {
            return new Response(JSON.stringify({error: 'Lease not found'}), {
                status: 404,
                headers: {'Content-Type': 'application/json'},
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({error: 'Failed to fetch lease details'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
}