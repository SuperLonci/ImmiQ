export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    buildings: Building[];
    createdAt: Date;
    updatedAt: Date;
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
    createdAt: Date;
    updatedAt: Date;
}

export interface Apartment {
    id: string;
    name: string;
    size: number;
    sizeUnit: SizeUnit;
    buildingId: string;
    building: Building;
    meters: Meter[];
    payments: Payment[];
    costs: Cost[];
    floor: number;
    leases: Lease[];
    type: ApartmentType;
    createdAt: Date;
    updatedAt: Date;
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
    createdAt: Date;
    updatedAt: Date;
}

export interface Cost {
    id: string;
    name: string;
    amount: number;
    currency: Currency;
    type: CostType;
    interval: CostInterval;
    biller: string;
    occurredAt: Date;
    buildingId?: string;
    building?: Building;
    apartmentId?: string;
    apartment?: Apartment;
    createdAt: Date;
    updatedAt: Date;
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
    createdAt: Date;
    updatedAt: Date;
}

export interface Tenant {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    leases: Lease[];
    createdAt: Date;
    updatedAt: Date;
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
    createdAt: Date;
    updatedAt: Date;
}

export enum Currency {
    EUR = 'EUR',
    USD = 'USD',
    GBP = 'GBP',
}

export enum SizeUnit {
    SQM = 'SQM',
    SQFT = 'SQFT',
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

// Form schema definitions for each entity type
export type FormFieldSchema = {
    name: string;
    type: 'text' | 'number' | 'select' | 'date' | 'boolean';
    label: string;
    required: boolean;
    options?: string[];
    defaultValue?: any;
};

// Building schema
export const buildingSchema: FormFieldSchema[] = [
    {name: 'name', type: 'text', label: 'Building Name', required: true},
    {name: 'address', type: 'text', label: 'Address', required: true},
    {name: 'floors', type: 'number', label: 'Number of Floors', required: true}
];

// Apartment schema
export const apartmentSchema: FormFieldSchema[] = [
    {name: 'name', type: 'text', label: 'Apartment Name', required: true},
    {name: 'size', type: 'number', label: 'Size', required: true},
    {
        name: 'sizeUnit',
        type: 'select',
        label: 'Size Unit',
        options: Object.values(SizeUnit),
        required: true
    },
    {name: 'floor', type: 'number', label: 'Floor Number', required: true},
    {
        name: 'type',
        type: 'select',
        label: 'Apartment Type',
        options: Object.values(ApartmentType),
        required: true
    }
];

// Cost schema
export const costSchema: FormFieldSchema[] = [
    {name: 'name', type: 'text', label: 'Cost Name', required: true},
    {name: 'amount', type: 'number', label: 'Amount', required: true},
    {
        name: 'currency',
        type: 'select',
        label: 'Currency',
        options: Object.values(Currency),
        required: true
    },
    {
        name: 'type',
        type: 'select',
        label: 'Cost Type',
        options: Object.values(CostType),
        required: true
    },
    {
        name: 'interval',
        type: 'select',
        label: 'Interval',
        options: Object.values(CostInterval),
        required: true
    },
    {name: 'biller', type: 'text', label: 'Biller', required: true},
    {name: 'occurredAt', type: 'date', label: 'Date Occurred', required: true}
];

// Payment schema
export const paymentSchema: FormFieldSchema[] = [
    {name: 'amount', type: 'number', label: 'Amount', required: true},
    {
        name: 'currency',
        type: 'select',
        label: 'Currency',
        options: Object.values(Currency),
        required: true
    },
    {name: 'dueDate', type: 'date', label: 'Due Date', required: true},
    {name: 'status', type: 'text', label: 'Status', required: true},
    {
        name: 'type',
        type: 'select',
        label: 'Payment Type',
        options: Object.values(PaymentType),
        required: true
    }
];

// Tenant schema
export const tenantSchema: FormFieldSchema[] = [
    {name: 'name', type: 'text', label: 'Tenant Name', required: true},
    {name: 'email', type: 'text', label: 'Email', required: true},
    {name: 'phoneNumber', type: 'text', label: 'Phone Number', required: true}
];

// Lease schema
export const leaseSchema: FormFieldSchema[] = [
    {name: 'startDate', type: 'date', label: 'Start Date', required: true},
    {name: 'endDate', type: 'date', label: 'End Date', required: false},
    {name: 'rentAmount', type: 'number', label: 'Rent Amount', required: true},
    {
        name: 'currency',
        type: 'select',
        label: 'Currency',
        options: Object.values(Currency),
        required: true
    }
];

// Meter schema
export const meterSchema: FormFieldSchema[] = [
    {name: 'type', type: 'text', label: 'Meter Type', required: true},
    {name: 'value', type: 'number', label: 'Meter Value', required: false},
    {name: 'unit', type: 'text', label: 'Unit', required: true},
    {name: 'costPerUnit', type: 'number', label: 'Cost Per Unit', required: true}
];

// Helper function to get schema by entity type
export function getSchemaForEntityType(entityType: string): FormFieldSchema[] {
    const schemas: Record<string, FormFieldSchema[]> = {
        'building': buildingSchema,
        'buildings': buildingSchema,
        'apartment': apartmentSchema,
        'apartments': apartmentSchema,
        'cost': costSchema,
        'costs': costSchema,
        'payment': paymentSchema,
        'payments': paymentSchema,
        'tenant': tenantSchema,
        'tenants': tenantSchema,
        'lease': leaseSchema,
        'leases': leaseSchema,
        'meter': meterSchema,
        'meters': meterSchema
    };

    return schemas[entityType] || [];
}