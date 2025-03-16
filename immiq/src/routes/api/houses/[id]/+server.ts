import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function GET({params}) {
    const {id} = params;
    try {
        const house = await prisma.house.findUnique({
            where: {id},
        });
        if (house) {
            return new Response(JSON.stringify(house), {
                headers: {'Content-Type': 'application/json'},
            });
        } else {
            return new Response(JSON.stringify({error: 'House not found'}), {
                status: 404,
                headers: {'Content-Type': 'application/json'},
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({error: 'Failed to fetch house details'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        await prisma.$disconnect();
    }
}