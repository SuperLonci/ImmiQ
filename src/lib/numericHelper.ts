export function parseNumericValue(value: any, fieldName: string): number | never {
    const parsedValue = parseFloat(String(value).replace(',', '.'));
    if (isNaN(parsedValue)) {
        throw new Error(`Invalid numeric value for "${fieldName}" field`);
    }
    return parsedValue;
}