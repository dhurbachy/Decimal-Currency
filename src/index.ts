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

   toString(): string {
    return this.value;
  }

  toNumber(): number {
    return Number(this.value);
  }
}