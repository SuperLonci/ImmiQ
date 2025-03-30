import prisma from '$lib/server/prisma';
import type {RequestHandler} from './$types';

// GET all leases
export const GET: RequestHandler = async () => {
    try {
        const leases = await prisma.lease.findMany({
            include: {
                apartment: {
                    select: {
                        name: true
                    }
                },
                tenant: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return new Response(JSON.stringify(leases), {
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Failed to fetch leases',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
};

// POST a new lease
export const POST: RequestHandler = async ({request}) => {
    try {
        // Parse the request body
        const data = await request.json();

        // Create the lease
        const lease = await prisma.lease.create({
            data,
            include: {
                apartment: {
                    select: {
                        name: true
                    }
                },
                tenant: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return new Response(JSON.stringify(lease), {
            status: 201, // Created
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        console.error('Error creating lease:', error);

        // Handle validation errors more gracefully
        if (error instanceof Error && 'code' in error && error.code === 'P2002') {
            return new Response(JSON.stringify({
                message: 'A lease with these details already exists'
            }), {
                status: 400,
                headers: {'Content-Type': 'application/json'},
            });
        }

        return new Response(JSON.stringify({
            message: 'Failed to create lease',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
};