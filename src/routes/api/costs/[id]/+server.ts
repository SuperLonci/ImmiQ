import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

// GET a specific cost by ID
export const GET: RequestHandler = async ({ params }) => {
    try {
        // Access the id from params
        const id = params.id;

        const cost = await prisma.cost.findUnique({
            where: { id },
            include: {
                apartment: {
                    select: {
                        name: true
                    }
                },
                building: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (!cost) {
            return new Response(JSON.stringify({ message: 'Cost not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify(cost), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Failed to fetch cost',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};

// PUT to update a cost
export const PUT: RequestHandler = async ({ params, request }) => {
    try {
        const id = params.id;

        // Verify cost exists
        const existingCost = await prisma.cost.findUnique({
            where: { id }
        });

        if (!existingCost) {
            return new Response(JSON.stringify({
                message: 'Cost not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await request.json();

        // Clean up empty relationship fields
        if (data.apartmentId === '') {
            delete data.apartmentId;
        }

        if (data.buildingId === '') {
            delete data.buildingId;
        }

        // Validate relationships
        if (data.apartmentId && data.buildingId) {
            return new Response(JSON.stringify({
                message: 'A cost cannot belong to both an apartment and a building'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!data.apartmentId && !data.buildingId) {
            return new Response(JSON.stringify({
                message: 'Either apartmentId or buildingId must be provided'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Prepare update data
        const updateData: any = {
            name: data.name,
            amount: data.amount,
            currency: data.currency,
            type: data.type,
            interval: data.interval,
            biller: data.biller,
            occurredAt: data.occurredAt ? new Date(data.occurredAt).toISOString() : undefined
        };

        // Handle relationships
        if (data.apartmentId) {
            updateData.apartment = { connect: { id: data.apartmentId } };
        } else if (data.buildingId) {
            updateData.building = { connect: { id: data.buildingId } };
        }

        // Update the cost
        const cost = await prisma.cost.update({
            where: { id },
            data: updateData
        });

        return new Response(JSON.stringify(cost), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating cost:', error);

        // Handle record not found
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return new Response(JSON.stringify({
                message: 'Cost not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            message: 'Failed to update cost',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};

// DELETE a cost
export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const id = params.id;

        // Verify cost exists
        const existingCost = await prisma.cost.findUnique({
            where: { id }
        });

        if (!existingCost) {
            return new Response(JSON.stringify({
                message: 'Cost not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await prisma.cost.delete({
            where: { id }
        });

        return new Response(JSON.stringify({ message: 'Cost deleted successfully' }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error deleting cost:', error);

        // Handle record not found
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return new Response(JSON.stringify({
                message: 'Cost not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            message: 'Failed to delete cost',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};