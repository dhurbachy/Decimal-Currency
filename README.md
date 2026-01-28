# Decimal Currency

A JavaScript library for performing decimal-safe currency calculations without floating-point rounding errors. Perfect for financial applications where precision is critical.

## The Problem: Floating-Point Arithmetic in JavaScript

JavaScript uses binary floating-point numbers (IEEE 754), which can't accurately represent decimal fractions. This leads to unexpected rounding errors in financial calculations:

```javascript
// The classic problem
0.1 + 0.2 === 0.3; // false!
// Why? Because:
0.1 + 0.2; // 0.30000000000000004

// More financial examples:
29.99 * 100; // 2998.9999999999995 instead of 2999
1.15 * 100; // 114.99999999999999 instead of 115
0.1 + 0.7; // 0.7999999999999999 instead of 0.8

// This causes serious issues in financial calculations:
const price = 19.99;
const quantity = 3;
const total = price * quantity; // 59.96999999999999 instead of 59.97

const taxRate = 0.0875; // 8.75%
const subtotal = 100.00;
const tax = subtotal * taxRate; // 8.749999999999998 instead of 8.75
```

## The Solution: Decimal Currency

This library stores numbers as strings and performs calculations using integer arithmetic, completely avoiding floating-point errors.

## Installation

```bash
npm install decimalcurrency
```

Or include directly in your HTML:

```html
<script src="decimalcurrency.js"></script>
```

## Usage

### Basic Operations

```javascript
import { DecimalCurrency } from 'decimalcurrency';

// Create instances
const price = new DecimalCurrency('19.99');
const quantity = new DecimalCurrency('3');
const taxRate = new DecimalCurrency('0.0875'); // 8.75%

// Addition
const result1 = new DecimalCurrency('0.1').add('0.2');
console.log(result1.toString()); // "0.3"
console.log(result1.toNumber()); // 0.3

// Multiplication
const subtotal = price.multiply(quantity);
console.log(subtotal.toString()); // "59.97" (not 59.96999999999999!)

// Division
const share = new DecimalCurrency('100').divide('3', 2);
console.log(share.toString()); // "33.33"

// Complex calculation: Calculate total with tax
const calculateTotal = (price, quantity, taxRate) => {
  const subtotal = price.multiply(quantity);
  const tax = subtotal.multiply(taxRate);
  return subtotal.add(tax);
};

const total = calculateTotal(price, quantity, taxRate);
console.log(total.toString()); // "65.18" (precise calculation)
```

### Financial Applications

#### Invoice Calculation
```javascript
class InvoiceCalculator {
  constructor(items, taxRate, discount = 0) {
    this.items = items.map(item => ({
      price: new DecimalCurrency(item.price),
      quantity: new DecimalCurrency(item.quantity)
    }));
    this.taxRate = new DecimalCurrency(taxRate);
    this.discount = new DecimalCurrency(discount);
  }
  
  calculateSubtotal() {
    return this.items.reduce((total, item) => 
      total.add(item.price.multiply(item.quantity)), 
      new DecimalCurrency('0')
    );
  }
  
  calculateTotal() {
    const subtotal = this.calculateSubtotal();
    const discountAmount = subtotal.multiply(this.discount.divide('100'));
    const afterDiscount = subtotal.subtract(discountAmount);
    const tax = afterDiscount.multiply(this.taxRate);
    return afterDiscount.add(tax);
  }
}

// Example usage
const invoice = new InvoiceCalculator([
  { price: '29.99', quantity: '2' },
  { price: '9.95', quantity: '5' }
], '0.10', '5'); // 10% tax, 5% discount

console.log(invoice.calculateSubtotal().toString()); // "104.93"
console.log(invoice.calculateTotal().toString());    // "109.77" (precise)
```

#### Currency Conversion
```javascript
class CurrencyConverter {
  constructor(exchangeRates) {
    this.rates = Object.entries(exchangeRates).reduce((acc, [currency, rate]) => {
      acc[currency] = new DecimalCurrency(rate);
      return acc;
    }, {});
  }
  
  convert(amount, fromCurrency, toCurrency) {
    const amountDC = new DecimalCurrency(amount);
    if (fromCurrency === toCurrency) return amountDC;
    
    // Convert to USD first, then to target currency
    const usdAmount = amountDC.divide(this.rates[fromCurrency].toString());
    return usdAmount.multiply(this.rates[toCurrency].toString());
  }
}

const converter = new CurrencyConverter({
  USD: '1.0',
  EUR: '0.85',
  JPY: '110.50',
  GBP: '0.73'
});

const amount = new DecimalCurrency('100');
const converted = converter.convert('100', 'EUR', 'JPY');
console.log(converted.toString()); // "13000.00" (precise conversion)
```

### Comparison Operations

```javascript
const balance1 = new DecimalCurrency('100.50');
const balance2 = new DecimalCurrency('100.50');
const balance3 = new DecimalCurrency('100.51');

// Equality
console.log(balance1.equals(balance2)); // true
console.log(balance1.equals('100.50')); // true

// Comparisons
console.log(balance1.lessThan(balance3)); // true
console.log(balance3.greaterThan(balance1)); // true
console.log(balance1.greaterThanOrEqual('100.50')); // true

// Sign checks
const negativeBalance = new DecimalCurrency('-50.25');
console.log(balance1.isPositive()); // true
console.log(negativeBalance.isNegative()); // true
console.log(new DecimalCurrency('0').isZero()); // true
```

### Precision Control

```javascript
// Default precision is 10 decimal places
const precise = new DecimalCurrency('1').divide('3');
console.log(precise.toString()); // "0.3333333333"

// Custom precision
const lowPrecision = new DecimalCurrency('1').divide('3', 2);
console.log(lowPrecision.toString()); // "0.33"

const highPrecision = new DecimalCurrency('1').divide('3', 20);
console.log(highPrecision.toString()); // "0.33333333333333333333"
```

## API Reference

### Constructor
```typescript
new DecimalCurrency(num: string | number | DecimalCurrency, precision?: number = 10)
```

### Arithmetic Methods
- `add(n: Num, precision?: number): DecimalCurrency`
- `subtract(n: Num, precision?: number): DecimalCurrency`
- `multiply(n: Num, precision?: number): DecimalCurrency`
- `divide(n: Num, precision?: number): DecimalCurrency`

### Comparison Methods
- `equals(n: Num): boolean`
- `greaterThan(n: Num): boolean`
- `lessThan(n: Num): boolean`
- `greaterThanOrEqual(n: Num): boolean`
- `lessThanOrEqual(n: Num): boolean`

### Sign Methods
- `isPositive(): boolean`
- `isNegative(): boolean`
- `isZero(): boolean`

### Conversion Methods
- `toString(): string`
- `toNumber(): number`

## Performance Considerations

While `DecimalCurrency` ensures precision, it's slower than native number operations. Use it where precision is critical (financial calculations) and native numbers where performance is critical (scientific computing, games).

```javascript
// For precision-critical operations
const preciseTotal = priceDC.multiply(quantityDC);

// For performance-critical operations (if precision isn't critical)
const fastTotal = price * quantity;
```

## Best Practices

1. **Always initialize with strings** for exact representation:
   ```javascript
   // Good
   new DecimalCurrency('0.1');
   
   // Bad (initial floating-point error)
   new DecimalCurrency(0.1);
   ```

2. **Chain operations carefully**:
   ```javascript
   // Good: Single operation
   const result = a.multiply(b).add(c);
   
   // Better for complex calculations: Store intermediate results
   const intermediate = a.multiply(b);
   const result = intermediate.add(c);
   ```

3. **Set appropriate precision** for your use case:
   ```javascript
   // Currency: 2 decimal places
   const currency = new DecimalCurrency('100.50', 2);
   
   // High-precision calculations: More decimal places
   const precise = new DecimalCurrency('1', 20).divide('3');
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

## Support

For bugs, feature requests, or questions, please [open an issue](https://github.com/dhurbachy/Decimal-Currency/issues).

---

**Perfect for:** E-commerce platforms, banking applications, accounting software, tax calculators, currency converters, and any application where financial precision matters.