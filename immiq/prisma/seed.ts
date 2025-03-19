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

    // Create Buildings
    const building1 = await prisma.building.create({
        data: {
            name: 'Sunset Villa',
            address: '123 Sunset Blvd',
            userId: user1.id,
            floors: 2,
        },
    });

    const building2 = await prisma.building.create({
        data: {
            name: 'Modern Loft',
            address: '456 Modern St',
            userId: user2.id,
            floors: 1,
        },
    });

    // Create Apartments
    const apartment1 = await prisma.apartment.create({
        data: {
            name: 'Apartment 1A',
            buildingId: building1.id,
            floor: 0,
            type: 'APARTMENT',
        },
    });

    const apartment2 = await prisma.apartment.create({
        data: {
            name: 'Apartment 2A',
            buildingId: building1.id,
            floor: 1,
            type: 'APARTMENT',
        },
    });

    const apartment3 = await prisma.apartment.create({
        data: {
            name: 'Apartment 2B',
            buildingId: building1.id,
            floor: 1,
            type: 'APARTMENT',
        },
    });

    const apartment4 = await prisma.apartment.create({
        data: {
            name: 'Apartment 2A',
            buildingId: building2.id,
            floor: 0,
            type: 'APARTMENT',
        },
    });

    // Create Meters
    const meter1 = await prisma.meter.create({
        data: {
            type: 'Water',
            unit: 'm3',
            costPerUnit: 2.5,
            buildingId: building1.id,
        },
    });

    const meter2 = await prisma.meter.create({
        data: {
            type: 'Electricity',
            unit: 'kWh',
            costPerUnit: 0.15,
            buildingId: building2.id,
        },
    });

    // Create Costs
    const cost1 = await prisma.cost.create({
        data: {
            name: 'Maintenance',
            amount: 100.0,
            currency: 'USD',
            type: 'SERVICE_CHARGE',
            interval: 'MONTHLY',
            buildingId: building1.id,
        },
    });

    const cost2 = await prisma.cost.create({
        data: {
            name: 'Security',
            amount: 150.0,
            currency: 'EUR',
            type: 'SERVICE_CHARGE',
            interval: 'YEARLY',
            buildingId: building2.id,
        },
    });

    // Create Payments
    const payment1 = await prisma.payment.create({
        data: {
            amount: 1200.0,
            currency: 'USD',
            dueDate: new Date('2023-11-01'),
            status: 'pending',
            type: 'REGULAR_RENT',
            apartmentId: apartment1.id,
        },
    });

    const payment2 = await prisma.payment.create({
        data: {
            amount: 1500.0,
            currency: 'USD',
            dueDate: new Date('2023-11-01'),
            status: 'paid',
            type: 'REGULAR_RENT',
            apartmentId: apartment2.id,
        },
    });

    const payment3 = await prisma.payment.create({
        data: {
            amount: 200.0,
            currency: 'USD',
            dueDate: new Date('2023-12-01'),
            status: 'pending',
            type: 'ADDITIONAL_PAYMENT',
            apartmentId: apartment1.id,
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