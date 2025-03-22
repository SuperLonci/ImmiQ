import {PrismaClient} from '@prisma/client';
import type {RequestEvent} from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function GET({params}: RequestEvent) {
    const {id} = params as { id: string };
    try {
        const tenant = await prisma.tenant.findUnique({
            where: {id},
        });
        if (tenant) {
            return new Response(JSON.stringify(tenant), {
                headers: {'Content-Type': 'application/json'},
            });
        } else {
            return new Response(JSON.stringify({error: 'Tenant not found'}), {
                status: 404,
                headers: {'Content-Type': 'application/json'},
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({error: 'Failed to fetch tenant details'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
}