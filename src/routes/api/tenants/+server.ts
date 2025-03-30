import prisma from '$lib/server/prisma';
import type {RequestHandler} from './$types';

// GET all tenants
export const GET: RequestHandler = async () => {
    try {
        const tenants = await prisma.tenant.findMany();

        return new Response(JSON.stringify(tenants), {
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Failed to fetch tenants',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
};

// POST a new tenant
export const POST: RequestHandler = async ({request}) => {
    try {
        // Parse the request body
        const data = await request.json();

        // Create the tenant
        const tenant = await prisma.tenant.create({
            data
        });

        return new Response(JSON.stringify(tenant), {
            status: 201, // Created
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        console.error('Error creating tenant:', error);

        // Handle validation errors more gracefully
        if (error instanceof Error && 'code' in error && error.code === 'P2002') {
            return new Response(JSON.stringify({
                message: 'A tenant with this information already exists'
            }), {
                status: 400,
                headers: {'Content-Type': 'application/json'},
            });
        }

        return new Response(JSON.stringify({
            message: 'Failed to create tenant',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
};