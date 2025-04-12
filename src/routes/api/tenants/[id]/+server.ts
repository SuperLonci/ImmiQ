import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

// GET a specific tenant by ID
export const GET: RequestHandler = async ({ params }) => {
    try {
        // Access the id from params
        const id = params.id;

        const tenant = await prisma.tenant.findUnique({
            where: { id },
            include: {
                leases: {
                    include: {
                        apartment: {
                            include: {
                                building: {
                                    include: {
                                        address: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!tenant) {
            return new Response(JSON.stringify({ message: 'Tenant not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify(tenant), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Failed to fetch tenant',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};

// PUT to update a tenant
export const PUT: RequestHandler = async ({ params, request }) => {
    try {
        const id = params.id;

        // Verify tenant exists
        const existingTenant = await prisma.tenant.findUnique({
            where: { id }
        });

        if (!existingTenant) {
            return new Response(JSON.stringify({
                message: 'Tenant not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await request.json();

        // can be deleted from the request because prisma will handle it
        delete data.createdAt;
        delete data.updatedAt;
        delete data.leases;

        const tenant = await prisma.tenant.update({
            where: { id },
            data
        });

        return new Response(JSON.stringify(tenant), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating tenant:', error);

        // Handle record not found
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return new Response(JSON.stringify({
                message: 'Tenant not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            message: 'Failed to update tenant',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};

// DELETE a tenant
export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const id = params.id;

        // Verify tenant exists
        const existingTenant = await prisma.tenant.findUnique({
            where: { id }
        });

        if (!existingTenant) {
            return new Response(JSON.stringify({
                message: 'Tenant not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await prisma.tenant.delete({
            where: { id }
        });

        return new Response(JSON.stringify({ message: 'Tenant deleted successfully' }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error deleting tenant:', error);

        // Handle record not found
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return new Response(JSON.stringify({
                message: 'Tenant not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            message: 'Failed to delete tenant',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};