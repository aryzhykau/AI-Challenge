const { Schema } = require('../src/schema');
const BaseValidator = require('../src/validators/BaseValidator');

describe('StringValidator', () => {
  test('validates string type', () => {
    const validator = Schema.string();
    expect(validator.validate('test').isValid).toBe(true);
    expect(validator.validate(123).isValid).toBe(false);
  });

  test('validates minLength', () => {
    const validator = Schema.string().minLength(3);
    expect(validator.validate('test').isValid).toBe(true);
    expect(validator.validate('te').isValid).toBe(false);
  });

  test('validates maxLength', () => {
    const validator = Schema.string().maxLength(3);
    expect(validator.validate('tes').isValid).toBe(true);
    expect(validator.validate('test').isValid).toBe(false);
  });

  test('validates pattern', () => {
    const validator = Schema.string().pattern(/^[a-z]+$/);
    expect(validator.validate('test').isValid).toBe(true);
    expect(validator.validate('test123').isValid).toBe(false);
  });

  test('validates required', () => {
    const validator = Schema.string().required();
    expect(validator.validate('test').isValid).toBe(true);
    expect(validator.validate('').isValid).toBe(false);
    expect(validator.validate(null).isValid).toBe(false);
    expect(validator.validate(undefined).isValid).toBe(false);
  });

  test('custom error message', () => {
    const validator = Schema.string().withMessage('Custom error');
    expect(validator.validate(123).errors[0]).toBe('Custom error');
  });
});

describe('NumberValidator', () => {
  test('validates number type', () => {
    const validator = Schema.number();
    expect(validator.validate(123).isValid).toBe(true);
    expect(validator.validate('123').isValid).toBe(false);
    expect(validator.validate(NaN).isValid).toBe(false);
  });

  test('validates min value', () => {
    const validator = Schema.number().min(5);
    expect(validator.validate(6).isValid).toBe(true);
    expect(validator.validate(5).isValid).toBe(true);
    expect(validator.validate(4).isValid).toBe(false);
  });

  test('validates max value', () => {
    const validator = Schema.number().max(5);
    expect(validator.validate(4).isValid).toBe(true);
    expect(validator.validate(5).isValid).toBe(true);
    expect(validator.validate(6).isValid).toBe(false);
  });

  test('validates integer', () => {
    const validator = Schema.number().integer();
    expect(validator.validate(5).isValid).toBe(true);
    expect(validator.validate(5.5).isValid).toBe(false);
  });

  test('validates positive numbers', () => {
    const validator = Schema.number().positive();
    expect(validator.validate(5).isValid).toBe(true);
    expect(validator.validate(0).isValid).toBe(false);
    expect(validator.validate(-5).isValid).toBe(false);
  });

  test('validates negative numbers', () => {
    const validator = Schema.number().negative();
    expect(validator.validate(-5).isValid).toBe(true);
    expect(validator.validate(0).isValid).toBe(false);
    expect(validator.validate(5).isValid).toBe(false);
  });

  test('validates required', () => {
    const validator = Schema.number().required();
    expect(validator.validate(5).isValid).toBe(true);
    expect(validator.validate(null).isValid).toBe(false);
    expect(validator.validate(undefined).isValid).toBe(false);
  });

  test('custom error message', () => {
    const validator = Schema.number().withMessage('Custom error');
    expect(validator.validate('not a number').errors[0]).toBe('Custom error');
  });
});

describe('BooleanValidator', () => {
  test('validates boolean type', () => {
    const validator = Schema.boolean();
    expect(validator.validate(true).isValid).toBe(true);
    expect(validator.validate(false).isValid).toBe(true);
    expect(validator.validate('true').isValid).toBe(false);
    expect(validator.validate(1).isValid).toBe(false);
  });

  test('validates required', () => {
    const validator = Schema.boolean().required();
    expect(validator.validate(true).isValid).toBe(true);
    expect(validator.validate(false).isValid).toBe(true);
    expect(validator.validate(null).isValid).toBe(false);
    expect(validator.validate(undefined).isValid).toBe(false);
  });

  test('custom error message', () => {
    const validator = Schema.boolean().withMessage('Custom error');
    expect(validator.validate('not a boolean').errors[0]).toBe('Custom error');
  });
});

describe('DateValidator', () => {
  test('validates date type', () => {
    const validator = Schema.date();
    expect(validator.validate(new Date()).isValid).toBe(true);
    expect(validator.validate('2020-01-01').isValid).toBe(false);
    expect(validator.validate(new Date('invalid')).isValid).toBe(false);
  });

  test('validates min date', () => {
    const min = new Date('2020-01-01');
    const validator = Schema.date().min(min);
    expect(validator.validate(new Date('2020-01-02')).isValid).toBe(true);
    expect(validator.validate(new Date('2020-01-01')).isValid).toBe(true);
    expect(validator.validate(new Date('2019-12-31')).isValid).toBe(false);
  });

  test('validates max date', () => {
    const max = new Date('2020-01-01');
    const validator = Schema.date().max(max);
    expect(validator.validate(new Date('2019-12-31')).isValid).toBe(true);
    expect(validator.validate(new Date('2020-01-01')).isValid).toBe(true);
    expect(validator.validate(new Date('2020-01-02')).isValid).toBe(false);
  });

  test('validates required', () => {
    const validator = Schema.date().required();
    expect(validator.validate(new Date()).isValid).toBe(true);
    const result = validator.validate(null);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Date is required');
  });

  test('custom error message', () => {
    const validator = Schema.date().withMessage('Custom error');
    expect(validator.validate('not a date').errors[0]).toBe('Custom error');
  });
});

describe('ObjectValidator', () => {
  test('validates object type', () => {
    const validator = Schema.object({
      name: Schema.string().required(),
      age: Schema.number().required()
    });
    expect(validator.validate({ name: 'John', age: 30 }).isValid).toBe(true);
    const result = validator.validate({ name: 'John' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toBeInstanceOf(Array);
  });

  test('validates nested objects', () => {
    const validator = Schema.object({
      user: Schema.object({
        name: Schema.string().required(),
        age: Schema.number().required()
      })
    });
    expect(validator.validate({ user: { name: 'John', age: 30 } }).isValid).toBe(true);
    const result = validator.validate({ user: { name: 'John' } });
    expect(result.isValid).toBe(false);
    expect(result.errors).toBeInstanceOf(Array);
  });

  test('custom error message', () => {
    const validator = Schema.object({
      name: Schema.string().required()
    }).withMessage('Custom error');
    expect(validator.validate({}).errors[0]).toBe('Custom error');
  });
});

describe('ArrayValidator', () => {
  test('validates array type', () => {
    const validator = Schema.array(Schema.string().required());
    expect(validator.validate(['a', 'b']).isValid).toBe(true);
    expect(validator.validate('not an array').isValid).toBe(false);
  });

  test('validates each item', () => {
    const validator = Schema.array(Schema.number().min(0));
    expect(validator.validate([1, 2, 3]).isValid).toBe(true);
    const result = validator.validate([1, -1, 3]);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Index 1: Number must be greater than or equal to 0');
  });

  test('validates minLength', () => {
    const validator = Schema.array(Schema.string()).minLength(2);
    expect(validator.validate(['a', 'b']).isValid).toBe(true);
    const result = validator.validate(['a']);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Array must have at least 2 items');
  });

  test('validates maxLength', () => {
    const validator = Schema.array(Schema.string()).maxLength(2);
    expect(validator.validate(['a', 'b']).isValid).toBe(true);
    const result = validator.validate(['a', 'b', 'c']);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Array must have at most 2 items');
  });

  test('validates required', () => {
    const validator = Schema.array(Schema.string()).required();
    expect(validator.validate(['a']).isValid).toBe(true);
    expect(validator.validate(null).isValid).toBe(false);
    expect(validator.validate(undefined).isValid).toBe(false);
  });

  test('custom error message', () => {
    const validator = Schema.array(Schema.string()).withMessage('Custom error');
    expect(validator.validate('not an array').errors[0]).toBe('Custom error');
  });
});

describe('Optional validation', () => {
  test('StringValidator optional', () => {
    const validator = Schema.string().optional();
    expect(validator.validate(undefined).isValid).toBe(true);
    expect(validator.validate(null).isValid).toBe(true);
    expect(validator.validate('test').isValid).toBe(true);
    expect(validator.validate(123).isValid).toBe(false);
  });

  test('NumberValidator optional', () => {
    const validator = Schema.number().optional();
    expect(validator.validate(undefined).isValid).toBe(true);
    expect(validator.validate(null).isValid).toBe(true);
    expect(validator.validate(123).isValid).toBe(true);
    expect(validator.validate('123').isValid).toBe(false);
  });

  test('BooleanValidator optional', () => {
    const validator = Schema.boolean().optional();
    expect(validator.validate(undefined).isValid).toBe(true);
    expect(validator.validate(null).isValid).toBe(true);
    expect(validator.validate(true).isValid).toBe(true);
    expect(validator.validate('true').isValid).toBe(false);
  });

  test('DateValidator optional', () => {
    const validator = Schema.date().optional();
    expect(validator.validate(undefined).isValid).toBe(true);
    expect(validator.validate(null).isValid).toBe(true);
    expect(validator.validate(new Date()).isValid).toBe(true);
    expect(validator.validate('2020-01-01').isValid).toBe(false);
  });

  test('ObjectValidator optional', () => {
    const validator = Schema.object({
      name: Schema.string().required()
    }).optional();
    expect(validator.validate(undefined).isValid).toBe(true);
    expect(validator.validate(null).isValid).toBe(true);
    expect(validator.validate({ name: 'John' }).isValid).toBe(true);
    expect(validator.validate({}).isValid).toBe(false);
  });

  test('ArrayValidator optional', () => {
    const validator = Schema.array(Schema.string()).optional();
    expect(validator.validate(undefined).isValid).toBe(true);
    expect(validator.validate(null).isValid).toBe(true);
    expect(validator.validate(['test']).isValid).toBe(true);
    expect(validator.validate('not an array').isValid).toBe(false);
  });
});

describe('EmailValidator', () => {
  test('validates email format', () => {
    const validator = Schema.email();
    expect(validator.validate('test@example.com').isValid).toBe(true);
    expect(validator.validate('user.name@domain.co.uk').isValid).toBe(true);
    expect(validator.validate('invalid-email').isValid).toBe(false);
    expect(validator.validate('@domain.com').isValid).toBe(false);
    expect(validator.validate('user@').isValid).toBe(false);
  });

  test('validates required', () => {
    const validator = Schema.email().required();
    expect(validator.validate('test@example.com').isValid).toBe(true);
    expect(validator.validate(null).isValid).toBe(false);
    expect(validator.validate(undefined).isValid).toBe(false);
  });

  test('validates optional', () => {
    const validator = Schema.email().optional();
    expect(validator.validate('test@example.com').isValid).toBe(true);
    expect(validator.validate(null).isValid).toBe(true);
    expect(validator.validate(undefined).isValid).toBe(true);
  });

  test('custom error message', () => {
    const validator = Schema.email().withMessage('Invalid email address');
    expect(validator.validate('invalid-email').errors[0]).toBe('Invalid email address');
  });
});

describe('PhoneValidator', () => {
  test('validates phone number format', () => {
    const validator = Schema.phone();
    expect(validator.validate('+1234567890').isValid).toBe(true);
    expect(validator.validate('+491234567890').isValid).toBe(true);
    expect(validator.validate('1234567890').isValid).toBe(true); // без плюса, но валидно
    expect(validator.validate('+1').isValid).toBe(true); // минимально валидный номер
    expect(validator.validate('001234567890').isValid).toBe(false);
    expect(validator.validate('phone').isValid).toBe(false);
    expect(validator.validate('+').isValid).toBe(false);
  });

  test('validates required', () => {
    const validator = Schema.phone().required();
    expect(validator.validate('+1234567890').isValid).toBe(true);
    expect(validator.validate(null).isValid).toBe(false);
    expect(validator.validate(undefined).isValid).toBe(false);
  });

  test('validates optional', () => {
    const validator = Schema.phone().optional();
    expect(validator.validate('+1234567890').isValid).toBe(true);
    expect(validator.validate(null).isValid).toBe(true);
    expect(validator.validate(undefined).isValid).toBe(true);
  });

  test('custom error message', () => {
    const validator = Schema.phone().withMessage('Invalid phone number');
    expect(validator.validate('not-a-phone').errors[0]).toBe('Invalid phone number');
  });
});

describe('URLValidator', () => {
  test('validates URL format', () => {
    const validator = Schema.url();
    expect(validator.validate('https://example.com').isValid).toBe(true);
    expect(validator.validate('http://sub.example.com/path').isValid).toBe(true);
    expect(validator.validate('ftp://example.com').isValid).toBe(true);
    expect(validator.validate('invalid-url').isValid).toBe(false);
    expect(validator.validate('http://').isValid).toBe(false);
  });

  test('validates specific protocols', () => {
    const validator = Schema.url().protocols(['https']);
    expect(validator.validate('https://example.com').isValid).toBe(true);
    expect(validator.validate('http://example.com').isValid).toBe(false);
    expect(validator.validate('ftp://example.com').isValid).toBe(false);
  });

  test('validates required', () => {
    const validator = Schema.url().required();
    expect(validator.validate('https://example.com').isValid).toBe(true);
    expect(validator.validate(null).isValid).toBe(false);
    expect(validator.validate(undefined).isValid).toBe(false);
  });

  test('validates optional', () => {
    const validator = Schema.url().optional();
    expect(validator.validate('https://example.com').isValid).toBe(true);
    expect(validator.validate(null).isValid).toBe(true);
    expect(validator.validate(undefined).isValid).toBe(true);
  });

  test('custom error message', () => {
    const validator = Schema.url().withMessage('Invalid URL');
    expect(validator.validate('not-a-url').errors[0]).toBe('Invalid URL');
  });
});

describe('IPAddressValidator', () => {
  test('validates IP address format', () => {
    const validator = Schema.ipAddress();
    
    expect(validator.validate('192.168.1.1').isValid).toBe(true);
    expect(validator.validate('2001:0db8:85a3:0000:0000:8a2e:0370:7334').isValid).toBe(true);
    expect(validator.validate('invalid').isValid).toBe(false);
    expect(validator.validate('256.1.2.3').isValid).toBe(false);
  });

  test('validates IPv4 only', () => {
    const validator = Schema.ipAddress().ipv4();
    
    expect(validator.validate('192.168.1.1').isValid).toBe(true);
    expect(validator.validate('2001:0db8:85a3:0000:0000:8a2e:0370:7334').isValid).toBe(false);
  });

  test('validates IPv6 only', () => {
    const validator = Schema.ipAddress().ipv6();
    
    expect(validator.validate('192.168.1.1').isValid).toBe(false);
    expect(validator.validate('2001:0db8:85a3:0000:0000:8a2e:0370:7334').isValid).toBe(true);
  });

  test('validates required IP address', () => {
    const validator = Schema.ipAddress().required();
    
    expect(validator.validate('192.168.1.1').isValid).toBe(true);
    expect(validator.validate(null).isValid).toBe(false);
    expect(validator.validate(undefined).isValid).toBe(false);
  });

  test('validates optional IP address', () => {
    const validator = Schema.ipAddress();
    
    expect(validator.validate('192.168.1.1').isValid).toBe(true);
    expect(validator.validate(null).isValid).toBe(true);
    expect(validator.validate(undefined).isValid).toBe(true);
  });

  test('validates with custom error message', () => {
    const validator = Schema.ipAddress().required('Please provide a valid IP address');
    
    const result = validator.validate(null);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please provide a valid IP address');
  });

  it('should validate IPv4 with leading zeros', () => {
    const validator = Schema.ipAddress().ipv4();
    expect(validator.validate('192.168.001.001')).toEqual({ isValid: false, errors: ['Invalid IPv4 address format'] });
  });

  it('should validate IPv4 with out of range values', () => {
    const validator = Schema.ipAddress().ipv4();
    expect(validator.validate('192.168.1.256')).toEqual({ isValid: false, errors: ['Invalid IPv4 address: octet must be between 0 and 255'] });
    expect(validator.validate('192.168.256.1')).toEqual({ isValid: false, errors: ['Invalid IPv4 address: octet must be between 0 and 255'] });
  });

  it('should validate IPv6 with invalid format', () => {
    const validator = Schema.ipAddress().ipv6();
    expect(validator.validate('2001:0db8:85a3:0000:0000:8a2e:0370:7334:extra')).toEqual({ isValid: false, errors: ['Invalid IP address format'] });
  });

  it('should validate IPv6 with invalid characters', () => {
    const validator = Schema.ipAddress().ipv6();
    expect(validator.validate('2001:0db8:85a3:0000:0000:8a2e:0370:g334')).toEqual({ isValid: false, errors: ['Invalid IP address format'] });
  });

  it('should validate IPv6 with invalid segment count', () => {
    const validator = Schema.ipAddress().ipv6();
    expect(validator.validate('2001:0db8:85a3:0000:0000:8a2e:0370')).toEqual({ isValid: false, errors: ['Invalid IP address format'] });
  });

  it('should validate IPv6 with invalid compression', () => {
    const validator = Schema.ipAddress().ipv6();
    expect(validator.validate('2001::0db8::85a3')).toEqual({ isValid: false, errors: ['Invalid IP address format'] });
  });

  it('should validate IPv6 with invalid segment length', () => {
    const validator = Schema.ipAddress().ipv6();
    expect(validator.validate('2001:0db8:85a3:00000:0000:8a2e:0370:7334')).toEqual({ isValid: false, errors: ['Invalid IP address format'] });
  });

  it('should validate mixed IP addresses', () => {
    const validator = Schema.ipAddress();
    expect(validator.validate('192.168.1.1')).toEqual({ isValid: true, errors: [] });
    expect(validator.validate('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toEqual({ isValid: true, errors: [] });
  });

  it('should handle custom error messages', () => {
    const validator = Schema.ipAddress().withMessage('Invalid IP address');
    expect(validator.validate('invalid')).toEqual({ isValid: false, errors: ['Invalid IP address'] });
  });

  it('should handle empty values when optional', () => {
    const validator = Schema.ipAddress().optional();
    expect(validator.validate('')).toEqual({ isValid: true, errors: [] });
    expect(validator.validate(null)).toEqual({ isValid: true, errors: [] });
    expect(validator.validate(undefined)).toEqual({ isValid: true, errors: [] });
  });

  it('should handle empty values when required', () => {
    const validator = Schema.ipAddress().required();
    expect(validator.validate('')).toEqual({ isValid: false, errors: ['IP address is required'] });
    expect(validator.validate(null)).toEqual({ isValid: false, errors: ['IP address is required'] });
    expect(validator.validate(undefined)).toEqual({ isValid: false, errors: ['IP address is required'] });
  });
});

describe('CreditCardValidator', () => {
  test('validates credit card number format', () => {
    const validator = Schema.creditCard();
    
    // Валидные номера карт
    expect(validator.validate('4532015112830366').isValid).toBe(true); // Visa
    expect(validator.validate('5424000000000015').isValid).toBe(true); // Mastercard
    expect(validator.validate('378282246310005').isValid).toBe(true);  // Amex
    expect(validator.validate('6011000000000012').isValid).toBe(true); // Discover
    expect(validator.validate('3530111333300000').isValid).toBe(true); // JCB

    // Невалидные номера
    expect(validator.validate('1234567890123456').isValid).toBe(false);
    expect(validator.validate('4532015112830367').isValid).toBe(false);
    expect(validator.validate('invalid').isValid).toBe(false);
  });

  test('validates specific card types', () => {
    const visa = Schema.creditCard().type('visa');
    const mastercard = Schema.creditCard().type('mastercard');
    const amex = Schema.creditCard().type('amex');
    
    expect(visa.validate('4532015112830366').isValid).toBe(true);
    expect(visa.validate('5424000000000015').isValid).toBe(false);
    
    expect(mastercard.validate('5424000000000015').isValid).toBe(true);
    expect(mastercard.validate('4532015112830366').isValid).toBe(false);
    
    expect(amex.validate('378282246310005').isValid).toBe(true);
    expect(amex.validate('4532015112830366').isValid).toBe(false);
  });

  test('validates required credit card', () => {
    const validator = Schema.creditCard().required();
    
    expect(validator.validate('4532015112830366').isValid).toBe(true);
    expect(validator.validate(null).isValid).toBe(false);
    expect(validator.validate(undefined).isValid).toBe(false);
  });

  test('validates optional credit card', () => {
    const validator = Schema.creditCard();
    
    expect(validator.validate('4532015112830366').isValid).toBe(true);
    expect(validator.validate(null).isValid).toBe(true);
    expect(validator.validate(undefined).isValid).toBe(true);
  });

  test('validates with custom error message', () => {
    const validator = Schema.creditCard().required('Please provide a valid credit card number');
    
    expect(validator.validate(null).message).toBe('Please provide a valid credit card number');
  });

  test('handles spaces and dashes in card numbers', () => {
    const validator = Schema.creditCard();
    
    expect(validator.validate('4532 0151 1283 0366').isValid).toBe(true);
    expect(validator.validate('4532-0151-1283-0366').isValid).toBe(true);
  });
});

describe('PasswordValidator', () => {
  it('should validate password length', () => {
    const validator = Schema.password().minLength(8).maxLength(20);
    expect(validator.validate('short')).toEqual({
      isValid: false,
      errors: ['Password must be at least 8 characters long']
    });
    expect(validator.validate('thispasswordiswaytoolong')).toEqual({
      isValid: false,
      errors: ['Password must be at most 20 characters long']
    });
    expect(validator.validate('validpassword')).toEqual({ isValid: true, errors: [] });
  });

  it('should validate password complexity', () => {
    const validator = Schema.password()
      .hasUppercase()
      .hasLowercase()
      .hasNumbers()
      .hasSpecial();

    expect(validator.validate('lowercase')).toEqual({
      isValid: false,
      errors: [
        'Password must contain at least one uppercase letter',
        'Password must contain at least one number',
        'Password must contain at least one special character'
      ]
    });
    expect(validator.validate('UPPERCASE')).toEqual({
      isValid: false,
      errors: [
        'Password must contain at least one lowercase letter',
        'Password must contain at least one number',
        'Password must contain at least one special character'
      ]
    });
    expect(validator.validate('NoSpecialChars1')).toEqual({
      isValid: false,
      errors: ['Password must contain at least one special character']
    });
    expect(validator.validate('ValidPass1!')).toEqual({ isValid: true, errors: [] });
  });

  it('should validate repeating characters', () => {
    const validator = Schema.password().noRepeatingChars(2);
    expect(validator.validate('aaa')).toEqual({
      isValid: false,
      errors: ['Password must not contain more than 2 repeating characters']
    });
    expect(validator.validate('aabbaa')).toEqual({ isValid: true, errors: [] });
  });

  it('should validate sequences', () => {
    const validator = Schema.password().noSequences(3);
    const result = validator.validate('abc123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must not contain sequential characters');
  });

  it('should validate required passwords', () => {
    const validator = Schema.password().required('Please enter a password');
    expect(validator.validate('')).toEqual({
      isValid: false,
      errors: ['Please enter a password']
    });
  });

  it('should combine multiple validations', () => {
    const validator = Schema.password()
      .minLength(8)
      .hasUppercase()
      .required();

    const result = validator.validate('weak');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters long');
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
  });

  it('should validate password with minimum length', () => {
    const validator = Schema.password().minLength(8);
    expect(validator.validate('short')).toEqual({ isValid: false, errors: ['Password must be at least 8 characters long'] });
    expect(validator.validate('longenough').isValid).toBe(true);
  });

  it('should validate password with maximum length', () => {
    const validator = Schema.password().maxLength(10);
    expect(validator.validate('tooolongpassword')).toEqual({ isValid: false, errors: ['Password must be at most 10 characters long'] });
    expect(validator.validate('justright').isValid).toBe(true);
  });

  it('should validate password with length range', () => {
    const validator = Schema.password().minLength(8).maxLength(12);
    expect(validator.validate('short')).toEqual({ isValid: false, errors: ['Password must be at least 8 characters long'] });
    expect(validator.validate('tooolongpassword')).toEqual({ isValid: false, errors: ['Password must be at most 12 characters long'] });
    expect(validator.validate('justright12').isValid).toBe(true);
  });

  it('should validate password with uppercase requirement', () => {
    const validator = Schema.password().hasUppercase();
    expect(validator.validate('lowercase')).toEqual({ isValid: false, errors: ['Password must contain at least one uppercase letter'] });
    expect(validator.validate('Uppercase').isValid).toBe(true);
  });

  it('should validate password with lowercase requirement', () => {
    const validator = Schema.password().hasLowercase();
    expect(validator.validate('UPPERCASE')).toEqual({ isValid: false, errors: ['Password must contain at least one lowercase letter'] });
    expect(validator.validate('Lowercase').isValid).toBe(true);
  });

  it('should validate password with number requirement', () => {
    const validator = Schema.password().hasNumbers();
    expect(validator.validate('NoNumbers')).toEqual({ isValid: false, errors: ['Password must contain at least one number'] });
    expect(validator.validate('With1Number').isValid).toBe(true);
  });

  it('should validate password with special character requirement', () => {
    const validator = Schema.password().hasSpecial();
    expect(validator.validate('NoSpecialChars')).toEqual({ isValid: false, errors: ['Password must contain at least one special character'] });
    expect(validator.validate('With@Special').isValid).toBe(true);
  });

  it('should validate password with repeating characters limit', () => {
    const validator = Schema.password().noRepeatingChars(2);
    const result = validator.validate('aaabbb');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must not contain more than 2 repeating characters');
    expect(validator.validate('aabbcc').isValid).toBe(true);
  });

  it('should validate password with sequential characters limit', () => {
    const validator = Schema.password().noSequences(3);
    const result = validator.validate('abc123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must not contain sequential characters');
    expect(validator.validate('ab12cd').isValid).toBe(true);
  });

  it('should validate password with all requirements', () => {
    const validator = Schema.password()
      .minLength(8)
      .maxLength(20)
      .hasUppercase()
      .hasLowercase()
      .hasNumbers()
      .hasSpecial()
      .noRepeatingChars(2)
      .noSequences(3);

    let result = validator.validate('weak');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters long');
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
    expect(result.errors).toContain('Password must contain at least one number');
    expect(result.errors).toContain('Password must contain at least one special character');

    result = validator.validate('weakpass');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
    expect(result.errors).toContain('Password must contain at least one number');
    expect(result.errors).toContain('Password must contain at least one special character');

    result = validator.validate('WeakPass');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number');
    expect(result.errors).toContain('Password must contain at least one special character');

    result = validator.validate('WeakPass123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one special character');
    
    result = validator.validate('WPass123!aaa');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must not contain more than 2 repeating characters');
  });

  it('should handle custom error messages', () => {
    const validator = Schema.password().minLength(8).withMessage('Custom length message');
    expect(validator.validate('short')).toEqual({ isValid: false, errors: ['Custom length message'] });
  });

  it('should handle empty values when optional', () => {
    const validator = Schema.password().optional();
    expect(validator.validate('')).toEqual({ isValid: true, errors: [] });
    expect(validator.validate(null)).toEqual({ isValid: true, errors: [] });
    expect(validator.validate(undefined)).toEqual({ isValid: true, errors: [] });
  });

  it('should handle empty values when required', () => {
    const validator = Schema.password().required();
    expect(validator.validate('')).toEqual({ isValid: false, errors: ['Password is required'] });
    expect(validator.validate(null)).toEqual({ isValid: false, errors: ['Password is required'] });
    expect(validator.validate(undefined)).toEqual({ isValid: false, errors: ['Password is required'] });
  });
});

describe('ColorValidator', () => {
  it('should validate HEX colors', () => {
    const validator = Schema.color();
    expect(validator.validate('#fff')).toEqual({ isValid: true, errors: [] });
    expect(validator.validate('#ffffff')).toEqual({ isValid: true, errors: [] });
    expect(validator.validate('#abc123')).toEqual({ isValid: true, errors: [] });
    expect(validator.validate('#abcd').isValid).toBe(false);
  });

  it('should validate RGB colors', () => {
    const validator = Schema.color();
    expect(validator.validate('rgb(255,255,255)')).toEqual({ isValid: true, errors: [] });
    expect(validator.validate('rgb(0, 0, 0)')).toEqual({ isValid: true, errors: [] });
    expect(validator.validate('rgb(256,0,0)').isValid).toBe(false);
    expect(validator.validate('rgb(0,0,256)').isValid).toBe(false);
  });

  it('should validate RGBA colors', () => {
    const validator = Schema.color();
    expect(validator.validate('rgba(255,255,255,1)')).toEqual({ isValid: true, errors: [] });
    expect(validator.validate('rgba(0,0,0,0.5)')).toEqual({ isValid: true, errors: [] });
    expect(validator.validate('rgba(0,0,0,1.1)').isValid).toBe(false);
    expect(validator.validate('rgba(0,0,0,-0.1)').isValid).toBe(false);
    expect(validator.validate('rgba(256,0,0,1)').isValid).toBe(false);
  });

  it('should validate HSL colors', () => {
    const validator = Schema.color();
    expect(validator.validate('hsl(360,100%,100%)')).toEqual({ isValid: true, errors: [] });
    expect(validator.validate('hsl(0,0%,0%)')).toEqual({ isValid: true, errors: [] });
    expect(validator.validate('hsl(361,0%,0%)').isValid).toBe(false);
    expect(validator.validate('hsl(0,101%,0%)').isValid).toBe(false);
  });

  it('should validate only allowed modes', () => {
    const validator = Schema.color().modesAllowed(['hex']);
    expect(validator.validate('#fff')).toEqual({ isValid: true, errors: [] });
    expect(validator.validate('rgb(0,0,0)').isValid).toBe(false);
  });

  it('should validate required color', () => {
    const validator = Schema.color().required('Color is required!');
    expect(validator.validate('')).toEqual({ isValid: false, errors: ['Color is required!'] });
    expect(validator.validate(null)).toEqual({ isValid: false, errors: ['Color is required!'] });
    expect(validator.validate(undefined)).toEqual({ isValid: false, errors: ['Color is required!'] });
    expect(validator.validate('#fff')).toEqual({ isValid: true, errors: [] });
  });
});

describe('BaseValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new BaseValidator();
  });

  it('should initialize with default values', () => {
    expect(validator.rules).toEqual([]);
    expect(validator.isRequired).toBe(false);
    expect(validator.customMessage).toBeUndefined();
  });

  it('should add rules correctly', () => {
    const rule = { validate: () => true, message: 'test' };
    validator.addRule(rule);
    expect(validator.rules.length).toBe(1);
  });

  it('should set custom message', () => {
    validator.withMessage('custom');
    expect(validator.customMessage).toBe('custom');
  });

  it('should set required flag', () => {
    validator.required();
    expect(validator.isRequired).toBe(true);
  });

  it('should set optional flag', () => {
    validator.required();
    validator.optional();
    expect(validator.isRequired).toBe(false);
  });

  it('should validate with multiple rules', () => {
    validator.addRule(() => ({ isValid: true, message: 'rule1' }));
    validator.addRule(() => ({ isValid: false, message: 'rule2' }));
    const result = validator.validate('test');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('rule2');
  });

  it('should return custom message when validation fails', () => {
    validator.addRule(() => ({ isValid: false, message: 'original' }));
    validator.withMessage('custom message');
    const result = validator.validate('test');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('custom message');
  });

  it('should handle required validation', () => {
    validator.required();
    expect(validator.validate(null)).toEqual({ isValid: false, errors: ['Value is required'] });
    expect(validator.validate(undefined)).toEqual({ isValid: false, errors: ['Value is required'] });
    expect(validator.validate('')).toEqual({ isValid: false, errors: ['Value is required'] });
  });

  it('should handle optional validation', () => {
    validator.optional();
    expect(validator.validate(null)).toEqual({ isValid: true, errors: [] });
    expect(validator.validate(undefined)).toEqual({ isValid: true, errors: [] });
    expect(validator.validate('')).toEqual({ isValid: true, errors: [] });
  });
}); 