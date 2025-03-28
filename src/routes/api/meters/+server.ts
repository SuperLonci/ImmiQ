import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
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
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        return new Response(JSON.stringify({error: 'Failed to fetch meters'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
}