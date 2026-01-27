type Num = string | number | DecimalCurrency;
export declare class DecimalCurrency {
    private readonly value;
    private readonly precision;
    constructor(num: Num, precision?: number);
    private getDecimalPlaces;
    private normalize;
    add(n: Num, precision?: number): DecimalCurrency;
    subtract(n: Num, precision?: number): DecimalCurrency;
    multiply(n: Num, precision?: number): DecimalCurrency;
    divide(n: Num, precision?: number): DecimalCurrency;
    equals(n: Num): boolean;
    greaterThan(n: Num): boolean;
    lessThan(n: Num): boolean;
    greaterThanOrEqual(n: Num): boolean;
    lessThanOrEqual(n: Num): boolean;
    isPositive(): boolean;
    isNegative(): boolean;
    isZero(): boolean;
    toString(): string;
    toNumber(): number;
}
export {};
//# sourceMappingURL=index.d.ts.map