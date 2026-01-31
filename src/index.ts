type Num = string | number | DecimalCurrency;

export class DecimalCurrency {
    private readonly value: string;
    private readonly precision: number;

    constructor(num: Num, precision: number = 10) {
        this.value = num.toString();
        this.precision = precision;
    }

    private getDecimalPlaces(num: string): number {
        if (!num.includes(".")) return 0;
        return num.split(".")[1].length;
    }

    private normalize(a: string, b: string) {
        const d1 = this.getDecimalPlaces(a);
        const d2 = this.getDecimalPlaces(b);
        const factor = Math.pow(10, Math.max(d1, d2));
        const n1 = Math.round(Number(a) * factor);
        const n2 = Math.round(Number(b) * factor);
        return { n1, n2, factor };
    }

    add(n: Num, precision?: number): DecimalCurrency {
        const p = precision ?? this.precision;
        const { n1, n2, factor } = this.normalize(this.value, n.toString());
        const result = (n1 + n2) / factor;
        return new DecimalCurrency(result.toFixed(p), p);
    }

    subtract(n: Num, precision?: number): DecimalCurrency {
        const p = precision ?? this.precision;
        const { n1, n2, factor } = this.normalize(this.value, n.toString());
        const result = (n1 - n2) / factor;
        return new DecimalCurrency(result.toFixed(p), p);
    }

    multiply(n: Num, precision?: number): DecimalCurrency {
        const p = precision ?? this.precision;
        const d1 = this.getDecimalPlaces(this.value);
        const d2 = this.getDecimalPlaces(n.toString());
        const n1 = Number(this.value.replace(".", ""));
        const n2 = Number(n.toString().replace(".", ""));
        const result = (n1 * n2) / Math.pow(10, d1 + d2);
        return new DecimalCurrency(result.toFixed(p), p);
    }

    divide(n: Num, precision?: number): DecimalCurrency {
        const p = precision ?? this.precision;
        const d1 = this.getDecimalPlaces(this.value);
        const d2 = this.getDecimalPlaces(n.toString());
        const n1 = Number(this.value.replace(".", ""));
        const n2 = Number(n.toString().replace(".", ""));
        const factor = Math.pow(10, d2 - d1);
        const result = (n1 / n2) * factor;
        return new DecimalCurrency(result.toFixed(p), p);
    }

    // ===== Comparison Methods =====
    equals(n: Num): boolean {
        const value = n instanceof DecimalCurrency ? n.value : n.toString();
        const { n1, n2 } = this.normalize(this.value, value);
        return n1 === n2;
    }

    greaterThan(n: Num): boolean {
        const value = n instanceof DecimalCurrency ? n.value : n.toString();
        const { n1, n2 } = this.normalize(this.value, value);
        return n1 > n2;
    }

    lessThan(n: Num): boolean {
        const value = n instanceof DecimalCurrency ? n.value : n.toString();
        const { n1, n2 } = this.normalize(this.value, value);
        return n1 < n2;
    }

    greaterThanOrEqual(n: Num): boolean {
        return this.greaterThan(n) || this.equals(n);
    }

    lessThanOrEqual(n: Num): boolean {
        return this.lessThan(n) || this.equals(n);
    }

    // ===== Sign-based methods =====
    isPositive(): boolean {
        return this.greaterThan(0);
    }

    isNegative(): boolean {
        return this.lessThan(0);
    }

    isZero(): boolean {
        return this.equals(0);
    }


    toString(): string {
        return this.value;
    }

    toNumber(): number {
        return Number(this.value);
    }

    

}