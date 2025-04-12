import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';
import { parseNumericValue } from '$lib/numericHelper';

// GET meter by ID
export const GET: RequestHandler = async ({ params }) => {
    try {
        const meterId = params.id;

        const meter = await prisma.meter.findUnique({
            where: { id: meterId },
            include: {
                building: {
                    select: {
                        name: true,
                        address: true
                    }
                },
                apartment: {
                    select: {
                        name: true,
                        size: true,
                        floor: true,
                        sizeUnit: true
                    }
                }
            }
        });

        if (!meter) {
            return new Response(JSON.stringify({
                message: 'Meter not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify(meter), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching meter:', error);
        return new Response(JSON.stringify({
            message: 'Failed to fetch meter',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};

// PUT/PATCH to update meter
export const PUT: RequestHandler = async ({ params, request }) => {
    try {
        const meterId = params.id;
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
                message: 'A meter cannot belong to both an apartment and a building'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Handle numeric values
        if (data.value !== undefined && data.value !== null) {
            data.value = parseNumericValue(data.value, 'value');
        }

        if (data.costPerUnit !== undefined) {
            data.costPerUnit = parseNumericValue(data.costPerUnit, 'costPerUnit');
        }

        // Prepare update data
        const updateData: any = {
            type: data.type,
            value: data.value,
            unit: data.unit,
            costPerUnit: data.costPerUnit
        };

        // Add relationships if provided
        if (data.apartmentId) {
            updateData.apartment = { connect: { id: data.apartmentId } };
            updateData.building = { disconnect: true };
        } else if (data.buildingId) {
            updateData.building = { connect: { id: data.buildingId } };
            updateData.apartment = { disconnect: true };
        } else {
            updateData.apartment = { disconnect: true };
            updateData.building = { disconnect: true };
        }

        const updatedMeter = await prisma.meter.update({
            where: { id: meterId },
            data: updateData,
            include: {
                building: {
                    select: {
                        name: true
                    }
                },
                apartment: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return new Response(JSON.stringify(updatedMeter), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating meter:', error);

        if (error instanceof Error && 'code' in error) {
            if (error.code === 'P2025') {
                return new Response(JSON.stringify({
                    message: 'Meter not found'
                }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
            } else if (error.code === 'P2003') {
                return new Response(JSON.stringify({
                    message: 'The referenced apartment or building does not exist'
                }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        return new Response(JSON.stringify({
            message: 'Failed to update meter',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};

// DELETE meter
export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const meterId = params.id;

        await prisma.meter.delete({
            where: { id: meterId }
        });

        return new Response(JSON.stringify({
            message: 'Meter deleted successfully'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error deleting meter:', error);

        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return new Response(JSON.stringify({
                message: 'Meter not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            message: 'Failed to delete meter',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};