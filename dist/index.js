export class DecimalCurrency {
    constructor(num, precision = 10) {
        this.value = num.toString();
        this.precision = precision;
    }
    getDecimalPlaces(num) {
        if (!num.includes("."))
            return 0;
        return num.split(".")[1].length;
    }
    normalize(a, b) {
        const d1 = this.getDecimalPlaces(a);
        const d2 = this.getDecimalPlaces(b);
        const factor = Math.pow(10, Math.max(d1, d2));
        const n1 = Math.round(Number(a) * factor);
        const n2 = Math.round(Number(b) * factor);
        return { n1, n2, factor };
    }
    add(n, precision) {
        const p = precision !== null && precision !== void 0 ? precision : this.precision;
        const { n1, n2, factor } = this.normalize(this.value, n.toString());
        const result = (n1 + n2) / factor;
        return new DecimalCurrency(result.toFixed(p), p);
    }
    toString() {
        return this.value;
    }
    toNumber() {
        return Number(this.value);
    }
}
