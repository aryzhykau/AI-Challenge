const { Schema } = require('../src/schema');

// --- Password Validator Example ---
const passwordSchema = Schema.password()
  .minLength(8)
  .hasUppercase()
  .hasLowercase()
  .hasNumbers()
  .hasSpecial();

const strongPasswordResult = passwordSchema.validate('Str0ngP@ss!');
console.log('Strong password validation passed:', strongPasswordResult.isValid); // true

const weakPasswordResult = passwordSchema.validate('weak');
console.log('Weak password validation failed:', weakPasswordResult.isValid); // false
console.log('Weak password errors:', weakPasswordResult.errors);
// Expected errors: [ 'Password must be at least 8 characters long', 'Password must contain at least one uppercase letter', ... ]

// --- IP Address Validator Example ---
const ipSchema = Schema.ipAddress().ipv4();

const validIpResult = ipSchema.validate('192.168.1.1');
console.log('Valid IP address validation passed:', validIpResult.isValid); // true

const invalidIpResult = ipSchema.validate('2001:0db8:85a3:0000:0000:8a2e:0370:7334'); // IPv6 address
console.log('Invalid IP address validation failed:', invalidIpResult.isValid); // false
console.log('Invalid IP address errors:', invalidIpResult.errors); // [ 'Invalid IPv4 address format' ]

// --- Credit Card Validator Example ---
const creditCardSchema = Schema.creditCard().type('visa');

const validCardResult = creditCardSchema.validate('4111222233334444');
console.log('Valid credit card validation passed:', validCardResult.isValid); // true

const invalidCardResult = creditCardSchema.validate('5111222233334444'); // Mastercard number
console.log('Invalid credit card validation failed:', invalidCardResult.isValid); // false
console.log('Invalid credit card errors:', invalidCardResult.errors); // [ 'Invalid Visa credit card number' ] 