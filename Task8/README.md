# Validation Library

A type-safe, extensible validation library for JavaScript/Node.js. Supports validation of strings, numbers, booleans, dates, objects, arrays, emails, phone numbers, and more, with a fluent API and custom error messages.

## Features
- Type-safe validators for all basic types
- Object and array schema validation (including nested)
- Optional and required fields
- Custom error messages
- Specialized validators for: Email, Phone, URL, IP Address, Credit Card, Password, and Color.
- Extensible with custom validators
- Fully tested with Jest

## Installation
```bash
npm install
```

## Usage Example
```javascript
const { Schema } = require('./src/schema');

const userSchema = Schema.object({
  id: Schema.string().withMessage('ID must be a string'),
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.email().required(),
  age: Schema.number().optional(),
  isActive: Schema.boolean(),
  tags: Schema.array(Schema.string()),
  phone: Schema.phone().optional(),
  website: Schema.url().optional(),
  address: Schema.object({
    street: Schema.string(),
    city: Schema.string(),
    postalCode: Schema.string().pattern(/^\d{5}$/).withMessage('Postal code must be 5 digits'),
    country: Schema.string()
  }).optional()
});

const userData = {
  id: '12345',
  name: 'John Doe',
  email: 'john@example.com',
  isActive: true,
  tags: ['developer', 'designer'],
  phone: '+1234567890',
  website: 'https://johndoe.com',
  address: {
    street: '123 Main St',
    city: 'Anytown',
    postalCode: '12345',
    country: 'USA'
  }
};

const result = userSchema.validate(userData);

if (result.isValid) {
  console.log('Validation passed!');
} else {
  console.log('Validation failed:', result.errors);
  // Example output: Validation failed: [ 'ID must be a string' ]
}
```

For more detailed examples, see the `examples/` directory.

## API Overview

All validators support `.required(message?)`, `.optional()`, and `.withMessage(message)` methods.

### StringValidator
- `.minLength(n)`: Sets the minimum string length.
- `.maxLength(n)`: Sets the maximum string length.
- `.pattern(regex)`: Requires the string to match a regular expression.

### NumberValidator
- `.min(n)` / `.max(n)`: Sets the minimum/maximum numeric value.
- `.integer()`: Requires the number to be an integer.
- `.positive()` / `.negative()`: Requires the number to be positive or negative.

### DateValidator
- `.min(date)` / `.max(date)`: Sets the minimum/maximum date.

### ObjectValidator
- `.object(schema)`: Validates an object against a nested schema.

### ArrayValidator
- `.array(itemValidator)`: Validates an array where each item is validated by `itemValidator`.
- `.minLength(n)` / `.maxLength(n)`: Sets the minimum/maximum array length.

### EmailValidator
- `.email()`: Validates for a standard email format.

### PhoneValidator
- `.phone()`: Validates for E.164 international phone number format.

### URLValidator
- `.protocols(protocols)`: Specifies an array of allowed protocols (e.g., `['http', 'https']`).

### IPAddressValidator
- `.ipv4()`: Requires the address to be a valid IPv4 address.
- `.ipv6()`: Requires the address to be a valid IPv6 address.

### CreditCardValidator
- `.type(cardType)`: Specifies the required credit card type (e.g., `'visa'`, `'mastercard'`).

### PasswordValidator
- `.minLength(n)` / `.maxLength(n)`: Sets password length constraints.
- `.hasUppercase()` / `.hasLowercase()`: Requires at least one uppercase/lowercase letter.
- `.hasNumbers()`: Requires at least one number.
- `.hasSpecial()`: Requires at least one special character.
- `.noRepeatingChars(n)`: Rejects passwords with `n` or more repeating characters.
- `.noSequences(n)`: Rejects passwords with character sequences of length `n` or more (e.g., 'abc', '123').

### ColorValidator
- `.modesAllowed(modes)`: Specifies an array of allowed color formats (e.g., `['hex', 'rgb']`).
- Supports HEX, RGB, RGBA, and HSL color formats.

## Testing
Run all tests with:
```bash
npm test
```

## License
MIT 