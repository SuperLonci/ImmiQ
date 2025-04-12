import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

// GET a specific lease by ID
export const GET: RequestHandler = async ({ params }) => {
    try {
        // Access the id from params
        const id = params.id;

        const lease = await prisma.lease.findUnique({
            where: { id },
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

        if (!lease) {
            return new Response(JSON.stringify({ message: 'Lease not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify(lease), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Failed to fetch lease',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};

// PUT to update a lease
export const PUT: RequestHandler = async ({ params, request }) => {
    try {
        const id = params.id;

        // Verify lease exists
        const existingLease = await prisma.lease.findUnique({
            where: { id }
        });

        if (!existingLease) {
            return new Response(JSON.stringify({
                message: 'Lease not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await request.json();

        // Ensure dates are in ISO-8601 format
        if (data.startDate) {
            data.startDate = new Date(data.startDate).toISOString();
        }
        if (data.endDate) {
            data.endDate = new Date(data.endDate).toISOString();
        }

        const updateData: any = {
            startDate: data.startDate,
            endDate: data.endDate,
            rentAmount: data.rentAmount,
            currency: data.currency
        };

        // Beziehungen aktualisieren
        if (data.apartmentId) {
            updateData.apartment = { connect: { id: data.apartmentId } };
        }
        if (data.tenantId) {
            updateData.tenant = { connect: { id: data.tenantId } };
        }

        const lease = await prisma.lease.update({
            where: { id },
            data: updateData,
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
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating lease:', error);

        // Handle record not found
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return new Response(JSON.stringify({
                message: 'Lease not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            message: 'Failed to update lease',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};

// DELETE a lease
export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const id = params.id;

        // Verify lease exists
        const existingLease = await prisma.lease.findUnique({
            where: { id }
        });

        if (!existingLease) {
            return new Response(JSON.stringify({
                message: 'Lease not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await prisma.lease.delete({
            where: { id }
        });

        return new Response(JSON.stringify({ message: 'Lease deleted successfully' }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error deleting lease:', error);

        // Handle record not found
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return new Response(JSON.stringify({
                message: 'Lease not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            message: 'Failed to delete lease',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};