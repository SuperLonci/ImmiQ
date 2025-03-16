import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create Users
    const user1 = await prisma.user.create({
        data: {
            email: 'user11@example.com',
            password: 'password1',
            name: 'User One',
        },
    });

    const user2 = await prisma.user.create({
        data: {
            email: 'user22@example.com',
            password: 'password2',
            name: 'User Two',
        },
    });

    // Create Houses
    const house1 = await prisma.house.create({
        data: {
            name: 'Sunset Villa',
            address: '123 Sunset Blvd',
            userId: user1.id,
            floors: 2,
        },
    });

    const house2 = await prisma.house.create({
        data: {
            name: 'Modern Loft',
            address: '456 Modern St',
            userId: user2.id,
            floors: 1,
        },
    });

    // Create Units
    const unit1 = await prisma.unit.create({
        data: {
            name: 'Unit 1A',
            houseId: house1.id,
            floor: 0,
        },
    });

    const unit2 = await prisma.unit.create({
        data: {
            name: 'Unit 2A',
            houseId: house1.id,
            floor: 1,
        },
    });

    const unit3 = await prisma.unit.create({
        data: {
            name: 'Unit 2B',
            houseId: house1.id,
            floor: 1,
        },
    });

    const unit4 = await prisma.unit.create({
        data: {
            name: 'Unit 2A',
            houseId: house2.id,
            floor: 0,
        },
    });

    // Create Meters
    const meter1 = await prisma.meter.create({
        data: {
            type: 'Water',
            houseId: house1.id,
        },
    });

    const meter2 = await prisma.meter.create({
        data: {
            type: 'Electricity',
            houseId: house2.id,
        },
    });

    // Create Fixed Costs
    const fixedCost1 = await prisma.fixedCost.create({
        data: {
            name: 'Maintenance',
            amount: 100.0,
            houseId: house1.id,
        },
    });

    const fixedCost2 = await prisma.fixedCost.create({
        data: {
            name: 'Security',
            amount: 150.0,
            houseId: house2.id,
        },
    });

    // Create Rents
    const rent1 = await prisma.rent.create({
        data: {
            amount: 1200.0,
            dueDate: new Date('2023-11-01'),
            status: 'pending',
            unitId: unit1.id,
        },
    });

    const rent2 = await prisma.rent.create({
        data: {
            amount: 1500.0,
            dueDate: new Date('2023-11-01'),
            status: 'paid',
            unitId: unit2.id,
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });