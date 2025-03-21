import {PrismaClient} from '@prisma/client';
import type {RequestEvent} from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function GET(event: RequestEvent) {
    try {
        const tenants = await prisma.tenant.findMany();
        return new Response(JSON.stringify(tenants), {
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        return new Response(JSON.stringify({error: 'Failed to fetch tenants'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
}