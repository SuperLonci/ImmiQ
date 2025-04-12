import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

// GET all addresses
export const GET: RequestHandler = async ({}) => {
    try {
        const addresses = await prisma.address.findMany({
            include: {}
        });

        return new Response(JSON.stringify(addresses), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Failed to fetch addresses',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};

// POST a new address
export const POST: RequestHandler = async ({ request, locals }) => {
    try {

        // Parse the request body
        const data = await request.json();

        if (!data.userId) {
            data.userId = locals.user!.id;
        }

        // Create the address with the user ID from the session
        const address = await prisma.address.create({
            data,
            include: {}
        });

        return new Response(JSON.stringify(address), {
            status: 201, // Created
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error creating address:', error);

        // Handle validation errors more gracefully
        if (error instanceof Error && 'code' in error && error.code === 'P2002') {
            return new Response(JSON.stringify({
                message: 'A address with this name or address already exists'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            message: 'Failed to create address',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};