export function roundAccurately(number: number, decimalPlaces: number): number {

    return Math.round(number * Math.pow(10, decimalPlaces) + Number.EPSILON) / Math.pow(10, decimalPlaces);
    //return Number(Math.round(number + Number.EPSILON + decimalPlaces) + Number.EPSILON + (decimalPlaces * -1))
}