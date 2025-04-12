import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

// GET a specific address by ID
export const GET: RequestHandler = async ({ params, locals }) => {
    try {
        // Access the id from params
        const id = params.id;

        const address = await prisma.address.findUnique({
            where: { id },
            include: {}
        });

        if (!address) {
            return new Response(JSON.stringify({ message: 'address not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Check if user has access to this address
        if (locals.user && address.userId !== locals.user.id) {
            return new Response(JSON.stringify({ message: 'Unauthorized access' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify(address), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Failed to fetch address',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};

// PUT to update an address
export const PUT: RequestHandler = async ({ params, request }) => {
    try {
        const id = params.id;

        // Verify ownership of the address
        const existingAddress = await prisma.address.findUnique({
            where: { id }
        });

        if (!existingAddress) {
            return new Response(JSON.stringify({
                message: 'address not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await request.json();

        delete data.createdAt;
        delete data.updatedAt;

        const updateData: any = {
            ...data
        };

        // Handle building relationship
        if (data.addressId) {
            updateData.address = { connect: { id: data.addressId } };
        }

        const address = await prisma.address.update({
            where: { id },
            data,
            include: {}
        });

        return new Response(JSON.stringify(address), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating address:', error);

        // Handle record not found
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return new Response(JSON.stringify({
                message: 'address not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            message: 'Failed to update address',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};

// DELETE an address
export const DELETE: RequestHandler = async ({ params, locals }) => {
    try {
        const id = params.id;

        // Verify ownership of the address
        const existingAddress = await prisma.address.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!existingAddress) {
            return new Response(JSON.stringify({
                message: 'address not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (existingAddress.userId !== locals.user!.id) {
            return new Response(JSON.stringify({
                message: 'Unauthorized: You do not own this address'
            }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await prisma.address.delete({
            where: { id }
        });

        return new Response(JSON.stringify({ message: 'address deleted successfully' }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error deleting address:', error);

        // Handle record not found
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return new Response(JSON.stringify({
                message: 'address not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            message: 'Failed to delete address',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};