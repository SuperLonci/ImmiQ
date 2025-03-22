import {PrismaClient} from '@prisma/client';
import type {RequestEvent} from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function GET({params}: RequestEvent) {
    const {id} = params as { id: string };
    try {
        const apartment = await prisma.apartment.findUnique({
            where: {id},
            include: {
                meters: true,
                costs: true,
                payments: true,
                leases: {
                    include: {
                        tenant: true
                    }
                },
                building: {
                    include: {
                        meters: true,
                        costs: true
                    }
                }
            }
        });
        if (apartment) {
            return new Response(JSON.stringify(apartment), {
                headers: {'Content-Type': 'application/json'},
            });
        } else {
            return new Response(JSON.stringify({error: 'apartment not found'}), {
                status: 404,
                headers: {'Content-Type': 'application/json'},
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({error: 'Failed to fetch apartment details'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
}