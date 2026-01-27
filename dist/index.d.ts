type Num = string | number | DecimalCurrency;
export declare class DecimalCurrency {
    private readonly value;
    private readonly precision;
    constructor(num: Num, precision?: number);
    private getDecimalPlaces;
    private normalize;
    add(n: Num, precision?: number): DecimalCurrency;
    toString(): string;
    toNumber(): number;
}
export {};
//# sourceMappingURL=index.d.ts.map