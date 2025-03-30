import prisma from '$lib/server/prisma';
import type {RequestHandler} from './$types';

// GET all buildings
export const GET: RequestHandler = async ({locals}) => {
    try {
        // If user is logged in, show only their buildings, otherwise show all (could be restricted in production)
        const where = locals.user ? {userId: locals.user.id} : {};

        const buildings = await prisma.building.findMany({
            where,
            include: {apartments: true}, // Include related apartments
        });

        return new Response(JSON.stringify(buildings), {
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Failed to fetch buildings',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
};

// POST a new building
export const POST: RequestHandler = async ({request, locals}) => {
    try {

        // Parse the request body
        const data = await request.json();

        if (!data.userId) {
            data.userId = locals.user!.id;
        }

        // Create the building with the user ID from the session
        const building = await prisma.building.create({
            data,
            include: {apartments: true}
        });

        return new Response(JSON.stringify(building), {
            status: 201, // Created
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        console.error('Error creating building:', error);

        // Handle validation errors more gracefully
        if (error instanceof Error && 'code' in error && error.code === 'P2002') {
            return new Response(JSON.stringify({
                message: 'A building with this name or address already exists'
            }), {
                status: 400,
                headers: {'Content-Type': 'application/json'},
            });
        }

        return new Response(JSON.stringify({
            message: 'Failed to create building',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
};