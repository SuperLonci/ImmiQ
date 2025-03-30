import prisma from '$lib/server/prisma';
import type {RequestHandler} from './$types';

// GET all costs
export const GET: RequestHandler = async () => {
    try {
        const costs = await prisma.cost.findMany({
            include: {} // Add related entities if needed
        });

        return new Response(JSON.stringify(costs), {
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Failed to fetch costs',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
};

// POST a new cost
export const POST: RequestHandler = async ({request}) => {
    try {
        // Parse the request body
        const data = await request.json();

        // Create the cost
        const cost = await prisma.cost.create({
            data
        });

        return new Response(JSON.stringify(cost), {
            status: 201, // Created
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        console.error('Error creating cost:', error);

        // Handle validation errors more gracefully
        if (error instanceof Error && 'code' in error && error.code === 'P2002') {
            return new Response(JSON.stringify({
                message: 'A cost with these details already exists'
            }), {
                status: 400,
                headers: {'Content-Type': 'application/json'},
            });
        }

        return new Response(JSON.stringify({
            message: 'Failed to create cost',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
};