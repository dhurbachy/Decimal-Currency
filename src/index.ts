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


    format(
        style: "EN" | "NP" = "EN",
        useDevanagariDigits: boolean = false
    ): string {
        let [intPart, decimalPart] = this.value.split(".");

        if (style === "EN") {
            intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        if (style === "NP") {
            const last3 = intPart.slice(-3);
            const rest = intPart.slice(0, -3);
            if (rest.length > 0) {
                intPart =
                    rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3;
            }
        }

        let result = decimalPart ? `${intPart}.${decimalPart}` : intPart;

        if (useDevanagariDigits) {
            const map: Record<string, string> = {
                "0": "०", "1": "१", "2": "२", "3": "३", "4": "४",
                "5": "५", "6": "६", "7": "७", "8": "८", "9": "९"
            };
            result = result.replace(/\d/g, d => map[d]);
        }

        return result;
    }

    toWords(
        system: "EN" | "NP" = "EN"
    ): string {
        const [intStr, decStr] = this.value.split(".");
        const num = BigInt(intStr);

        if (num === BigInt(0) && !decStr) return "Zero";

        const small = [
            "Zero", "One", "Two", "Three", "Four",
            "Five", "Six", "Seven", "Eight", "Nine",
            "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
            "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
        ];

        const tens = [
            "", "", "Twenty", "Thirty", "Forty",
            "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
        ];

        const international = [
            { value: BigInt("1000000000000000000"), name: "Quintillion" },
            { value: BigInt("1000000000000000"), name: "Quadrillion" },
            { value: BigInt("1000000000000"), name: "Trillion" },
            { value: BigInt("1000000000"), name: "Billion" },
            { value: BigInt("1000000"), name: "Million" },
            { value: BigInt("1000"), name: "Thousand" }
        ];

        const indic = [
            { value: BigInt("10000000000000000000"), name: "Maha Sankha" },
            { value: BigInt("100000000000000000"), name: "Sankha" },
            { value: BigInt("1000000000000000"), name: "Padma" },
            { value: BigInt("10000000000000"), name: "Nil" },
            { value: BigInt("100000000000"), name: "Kharab" },
            { value: BigInt("1000000000"), name: "Arab" },
            { value: BigInt("10000000"), name: "Crore" },
            { value: BigInt("100000"), name: "Lakh" },
            { value: BigInt("1000"), name: "Thousand" }
        ];

        const scales = system === "NP" ? indic : international;

        const convertInt = (n: bigint): string => {
            if (n < BigInt(20)) return small[Number(n)];
            if (n < BigInt(100))
                return tens[Number(n / BigInt(10))] + (n % BigInt(10) ? " " + small[Number(n % BigInt(10))] : "");
            if (n < BigInt(1000))
                return small[Number(n / BigInt(100))] + " Hundred" + (n % BigInt(100) ? " " + convertInt(n % BigInt(100)) : "");

            for (const s of scales) {
                if (n >= s.value) {
                    return convertInt(n / s.value) + " " + s.name + (n % s.value ? " " + convertInt(n % s.value) : "");
                }
            }
            return "";
        };

        let result = convertInt(num);

        // 🔹 Decimal handling
        if (decStr && BigInt(decStr) !== BigInt(0)) {
            const decimalWords = decStr.split("").map(d => small[Number(d)]).join(" ");
            result += " Point " + decimalWords;
        }

        return result.trim();
    }


}