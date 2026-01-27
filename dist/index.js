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
    subtract(n, precision) {
        const p = precision !== null && precision !== void 0 ? precision : this.precision;
        const { n1, n2, factor } = this.normalize(this.value, n.toString());
        const result = (n1 - n2) / factor;
        return new DecimalCurrency(result.toFixed(p), p);
    }
    multiply(n, precision) {
        const p = precision !== null && precision !== void 0 ? precision : this.precision;
        const d1 = this.getDecimalPlaces(this.value);
        const d2 = this.getDecimalPlaces(n.toString());
        const n1 = Number(this.value.replace(".", ""));
        const n2 = Number(n.toString().replace(".", ""));
        const result = (n1 * n2) / Math.pow(10, d1 + d2);
        return new DecimalCurrency(result.toFixed(p), p);
    }
    divide(n, precision) {
        const p = precision !== null && precision !== void 0 ? precision : this.precision;
        const d1 = this.getDecimalPlaces(this.value);
        const d2 = this.getDecimalPlaces(n.toString());
        const n1 = Number(this.value.replace(".", ""));
        const n2 = Number(n.toString().replace(".", ""));
        const factor = Math.pow(10, d2 - d1);
        const result = (n1 / n2) * factor;
        return new DecimalCurrency(result.toFixed(p), p);
    }
    // ===== Comparison Methods =====
    equals(n) {
        const value = n instanceof DecimalCurrency ? n.value : n.toString();
        const { n1, n2 } = this.normalize(this.value, value);
        return n1 === n2;
    }
    greaterThan(n) {
        const value = n instanceof DecimalCurrency ? n.value : n.toString();
        const { n1, n2 } = this.normalize(this.value, value);
        return n1 > n2;
    }
    lessThan(n) {
        const value = n instanceof DecimalCurrency ? n.value : n.toString();
        const { n1, n2 } = this.normalize(this.value, value);
        return n1 < n2;
    }
    greaterThanOrEqual(n) {
        return this.greaterThan(n) || this.equals(n);
    }
    lessThanOrEqual(n) {
        return this.lessThan(n) || this.equals(n);
    }
    // ===== Sign-based methods =====
    isPositive() {
        return this.greaterThan(0);
    }
    isNegative() {
        return this.lessThan(0);
    }
    isZero() {
        return this.equals(0);
    }
    toString() {
        return this.value;
    }
    toNumber() {
        return Number(this.value);
    }
}
