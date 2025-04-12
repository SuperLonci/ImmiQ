import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

// GET a specific apartment by ID
export const GET: RequestHandler = async ({ params }) => {
    try {
        // Access the id from params
        const id = params.id;

        const apartment = await prisma.apartment.findUnique({
            where: { id },
            include: {
                meters: true,
                costs: true,
                payments: true,
                leases: {
                    include: {
                        tenant: true
                    }
                },
                building: {
                    include: {
                        meters: true,
                        costs: true
                    }
                }
            }
        });

        if (!apartment) {
            return new Response(JSON.stringify({ message: 'Apartment not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify(apartment), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Failed to fetch apartment',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};

// PUT to update an apartment
export const PUT: RequestHandler = async ({ params, request }) => {
    try {
        const id = params.id;

        // Verify apartment exists
        const existingApartment = await prisma.apartment.findUnique({
            where: { id }
        });

        if (!existingApartment) {
            return new Response(JSON.stringify({
                message: 'Apartment not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await request.json();

        delete data.createdAt;
        delete data.updatedAt;

        const updateData: any = {
            name: data.name,
            size: data.size,
            sizeUnit: data.sizeUnit,
            floor: data.floor,
            type: data.type
        };

        // Handle building relationship
        if (data.buildingId) {
            updateData.building = { connect: { id: data.buildingId } };
        }

        const apartment = await prisma.apartment.update({
            where: { id },
            data: updateData,
            include: {
                meters: true,
                costs: true,
                payments: true,
                leases: {
                    include: {
                        tenant: true
                    }
                }
            }
        });

        return new Response(JSON.stringify(apartment), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating apartment:', error);

        // Handle record not found
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return new Response(JSON.stringify({
                message: 'Apartment not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            message: 'Failed to update apartment',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};

// DELETE an apartment
export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const id = params.id;

        // Verify apartment exists
        const existingApartment = await prisma.apartment.findUnique({
            where: { id }
        });

        if (!existingApartment) {
            return new Response(JSON.stringify({
                message: 'Apartment not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await prisma.apartment.delete({
            where: { id }
        });

        return new Response(JSON.stringify({ message: 'Apartment deleted successfully' }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error deleting apartment:', error);

        // Handle record not found
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return new Response(JSON.stringify({
                message: 'Apartment not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            message: 'Failed to delete apartment',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};