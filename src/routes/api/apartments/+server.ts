import prisma from '$lib/server/prisma';
import type {RequestHandler} from './$types';

// GET all apartments
export const GET: RequestHandler = async () => {
    try {
        const apartments = await prisma.apartment.findMany({
            include: {building: true},
        });

        return new Response(JSON.stringify(apartments), {
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Failed to fetch apartments',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
};

// POST a new apartment
export const POST: RequestHandler = async ({request}) => {
    try {
        // Parse the request body
        const data = await request.json();

        // Create the apartment
        const apartment = await prisma.apartment.create({
            data,
            include: {building: true}
        });

        return new Response(JSON.stringify(apartment), {
            status: 201, // Created
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        console.error('Error creating apartment:', error);

        // Handle validation errors more gracefully
        if (error instanceof Error && 'code' in error && error.code === 'P2002') {
            return new Response(JSON.stringify({
                message: 'An apartment with this name or number already exists'
            }), {
                status: 400,
                headers: {'Content-Type': 'application/json'},
            });
        }

        return new Response(JSON.stringify({
            message: 'Failed to create apartment',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
};