export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    houses: House[];
}

export interface House {
    id: string;
    name: string;
    address: string;
    units: Unit[];
    userId: string;
    user: User;
    fixedCosts: FixedCost[];
    floors: number;
    meters: Meter[];
}

export interface Unit {
    id: string;
    name: string;
    houseId: string;
    house: House;
    meters: Meter[];
    rent: Rent[];
    floor: number;
}

export interface Meter {
    id: string;
    type: string;
    unitId?: string;
    unit?: Unit;
    houseId?: string;
    house?: House;
}

export interface FixedCost {
    id: string;
    name: string;
    amount: number;
    houseId: string;
    house: House;
}

export interface Rent {
    id: string;
    amount: number;
    dueDate: Date;
    status: string;
    unitId: string;
    unit: Unit;
}