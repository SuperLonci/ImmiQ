export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    buildings: Building[];
}

export interface Building {
    id: string;
    name: string;
    address: string;
    apartments: Apartment[];
    userId: string;
    user: User;
    costs: Cost[];
    floors: number;
    meters: Meter[];
}

export interface Apartment {
    id: string;
    name: string;
    buildingId: string;
    building: Building;
    meters: Meter[];
    payments: Payment[];
    costs: Cost[];
    floor: number;
    leases: Lease[];
    type: ApartmentType;
}

export interface Meter {
    id: string;
    type: string;
    value?: number;
    unit: string;
    costPerUnit: number;
    apartmentId?: string;
    apartment?: Apartment;
    buildingId?: string;
    building?: Building;
}

export interface Cost {
    id: string;
    name: string;
    amount: number;
    currency: Currency;
    type: CostType;
    interval: CostInterval;
    buildingId?: string;
    building?: Building;
    apartmentId?: string;
    apartment?: Apartment;
}

export interface Payment {
    id: string;
    amount: number;
    currency: Currency;
    dueDate: Date;
    status: string;
    type: PaymentType;
    apartmentId: string;
    apartment: Apartment;
}

export interface Tenant {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    leases: Lease[];
}

export interface Lease {
    id: string;
    startDate: Date;
    endDate?: Date;
    rentAmount: number;
    currency: Currency;
    apartmentId: string;
    apartment: Apartment;
    tenantId: string;
    tenant: Tenant;
}

export enum Currency {
    EUR = 'EUR',
    USD = 'USD',
    GBP = 'GBP',
}

export enum CostInterval {
    ONE_TIME = 'ONE_TIME',
    MONTHLY = 'MONTHLY',
    QUARTERLY = 'QUARTERLY',
    YEARLY = 'YEARLY',
}

export enum CostType {
    SERVICE_CHARGE = 'SERVICE_CHARGE',
    BASE_RENT = 'BASE_RENT',
    OTHER = 'OTHER',
}

export enum PaymentType {
    REGULAR_RENT = 'REGULAR_RENT',
    ADDITIONAL_PAYMENT = 'ADDITIONAL_PAYMENT',
    SERVICE_CHARGE = 'SERVICE_CHARGE',
    OTHER = 'OTHER',
}

export enum ApartmentType {
    HOUSE = 'HOUSE',
    APARTMENT = 'APARTMENT',
    STUDIO = 'STUDIO',
    LOFT = 'LOFT',
    DUPLEX = 'DUPLEX',
    PENTHOUSE = 'PENTHOUSE',
}