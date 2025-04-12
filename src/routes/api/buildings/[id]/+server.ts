import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

// GET a specific building by ID
export const GET: RequestHandler = async ({ params, locals }) => {
    try {
        // Access the id from params
        const id = params.id;

        const building = await prisma.building.findUnique({
            where: { id },
            include: {
                apartments: true,
                costs: true,
                meters: true
            }
        });

        if (!building) {
            return new Response(JSON.stringify({ message: 'Building not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Check if user has access to this building
        if (locals.user && building.userId !== locals.user.id) {
            return new Response(JSON.stringify({ message: 'Unauthorized access' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify(building), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Failed to fetch building',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};

// PUT to update a building
export const PUT: RequestHandler = async ({ params, request, locals }) => {
    try {
        const id = params.id;

        // Verify ownership of the building
        const existingBuilding = await prisma.building.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!existingBuilding) {
            return new Response(JSON.stringify({
                message: 'Building not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (existingBuilding.userId !== locals.user!.id) {
            return new Response(JSON.stringify({
                message: 'Unauthorized: You do not own this building'
            }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await request.json();

        delete data.createdAt;
        delete data.updatedAt;
        delete data.apartments;

        const building = await prisma.building.update({
            where: { id },
            data,
            include: { apartments: true }
        });

        return new Response(JSON.stringify(building), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating building:', error);

        // Handle record not found
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return new Response(JSON.stringify({
                message: 'Building not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            message: 'Failed to update building',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};

// DELETE a building
export const DELETE: RequestHandler = async ({ params, locals }) => {
    try {
        const id = params.id;

        // Verify ownership of the building
        const existingBuilding = await prisma.building.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!existingBuilding) {
            return new Response(JSON.stringify({
                message: 'Building not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (existingBuilding.userId !== locals.user!.id) {
            return new Response(JSON.stringify({
                message: 'Unauthorized: You do not own this building'
            }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await prisma.building.delete({
            where: { id }
        });

        return new Response(JSON.stringify({ message: 'Building deleted successfully' }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error deleting building:', error);

        // Handle record not found
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return new Response(JSON.stringify({
                message: 'Building not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            message: 'Failed to delete building',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};