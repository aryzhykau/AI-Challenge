const BaseValidator = require('./BaseValidator');

class PasswordValidator extends BaseValidator {
  constructor() {
    super();
    this.addRule((value) => {
      if (typeof value !== 'string') {
        return { isValid: false, message: 'Password must be a string' };
      }
      return { isValid: true };
    });
  }

  minLength(length) {
    this.addRule((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true };
      }
      if (value.length < length) {
        return {
          isValid: false,
          message: `Password must be at least ${length} characters long`
        };
      }
      return { isValid: true };
    });
    return this;
  }

  maxLength(length) {
    this.addRule((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true };
      }
      if (value.length > length) {
        return {
          isValid: false,
          message: `Password must be at most ${length} characters long`
        };
      }
      return { isValid: true };
    });
    return this;
  }

  hasUppercase() {
    this.addRule((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true };
      }
      if (!/[A-Z]/.test(value)) {
        return {
          isValid: false,
          message: 'Password must contain at least one uppercase letter'
        };
      }
      return { isValid: true };
    });
    return this;
  }

  hasLowercase() {
    this.addRule((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true };
      }
      if (!/[a-z]/.test(value)) {
        return {
          isValid: false,
          message: 'Password must contain at least one lowercase letter'
        };
      }
      return { isValid: true };
    });
    return this;
  }

  hasNumbers() {
    this.addRule((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true };
      }
      if (!/\d/.test(value)) {
        return {
          isValid: false,
          message: 'Password must contain at least one number'
        };
      }
      return { isValid: true };
    });
    return this;
  }

  hasSpecial() {
    this.addRule((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true };
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        return {
          isValid: false,
          message: 'Password must contain at least one special character'
        };
      }
      return { isValid: true };
    });
    return this;
  }

  noRepeatingChars(maxRepeating = 2) {
    this.addRule((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true };
      }
      const repeatingPattern = new RegExp(`(.)\\1{${maxRepeating},}`, 'g');
      const matches = value.match(repeatingPattern);
      if (matches) {
        return {
          isValid: false,
          message: `Password must not contain more than ${maxRepeating} repeating characters`
        };
      }
      return { isValid: true };
    });
    return this;
  }

  noSequences(sequenceLength = 3) {
    this.addRule((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true };
      }
      const sequences = [
        'abcdefghijklmnopqrstuvwxyz',
        'zyxwvutsrqponmlkjihgfedcba',
        '0123456789',
        '9876543210'
      ];
      for (const sequence of sequences) {
        for (let i = 0; i <= sequence.length - sequenceLength; i++) {
          const seq = sequence.slice(i, i + sequenceLength);
          if (value.toLowerCase().includes(seq)) {
            return {
              isValid: false,
              message: 'Password must not contain sequential characters'
            };
          }
        }
      }
      return { isValid: true };
    });
    return this;
  }

  required(message = 'Password is required') {
    super.required(message);
    return this;
  }

  optional() {
    super.optional();
    return this;
  }

  withMessage(message) {
    super.withMessage(message);
    return this;
  }
}

module.exports = PasswordValidator; 