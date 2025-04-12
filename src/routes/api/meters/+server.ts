import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';
import { parseNumericValue } from '$lib/numericHelper';

// GET all meters
export const GET: RequestHandler = async () => {
    try {
        const meters = await prisma.meter.findMany({
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

        return new Response(JSON.stringify(meters), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Failed to fetch meters',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};

// POST a new meter
export const POST: RequestHandler = async ({ request }) => {
    try {
        // Parse the request body
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

        // If neither is provided, return error
        if (!data.apartmentId && !data.buildingId) {
            return new Response(JSON.stringify({
                message: 'Either apartmentId or buildingId must be provided'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Handle numeric values - ensure they're properly formatted
        if (data.value !== undefined && data.value !== null) {
            data.value = parseNumericValue(data.value, 'value');
        }

        if (data.costPerUnit !== undefined) {
            data.costPerUnit = parseNumericValue(data.costPerUnit, 'costPerUnit');
        }

        // Create the meter
        const meter = await prisma.meter.create({
            data,
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

        return new Response(JSON.stringify(meter), {
            status: 201, // Created
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error creating meter:', error);

        // Handle validation errors more gracefully
        if (error instanceof Error && 'code' in error) {
            if (error.code === 'P2002') {
                return new Response(JSON.stringify({
                    message: 'A meter with these details already exists'
                }), {
                    status: 400,
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
            message: 'Failed to create meter',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await prisma.$disconnect();
    }
};