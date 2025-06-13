const BaseValidator = require('./BaseValidator');

class NumberValidator extends BaseValidator {
  constructor() {
    super();
    this.rules.push(this.typeCheck);
  }

  typeCheck(value) {
    if (value === null || value === undefined || value === '') {
      return { isValid: true, errors: [] };
    }
    if (typeof value !== 'number' || isNaN(value)) {
      return {
        isValid: false,
        message: 'Value must be a number',
        errors: ['Value must be a number']
      };
    }
    return { isValid: true, errors: [] };
  }

  min(minValue) {
    this.rules.push((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true, errors: [] };
      }
      if (value < minValue) {
        const message = `Number must be greater than or equal to ${minValue}`;
        return {
          isValid: false,
          message,
          errors: [message]
        };
      }
      return { isValid: true, errors: [] };
    });
    return this;
  }

  max(maxValue) {
    this.rules.push((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true, errors: [] };
      }
      if (value > maxValue) {
        const message = `Number must be less than or equal to ${maxValue}`;
        return {
          isValid: false,
          message,
          errors: [message]
        };
      }
      return { isValid: true, errors: [] };
    });
    return this;
  }

  integer() {
    this.rules.push((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true, errors: [] };
      }
      if (!Number.isInteger(value)) {
        const message = 'Number must be an integer';
        return {
          isValid: false,
          message,
          errors: [message]
        };
      }
      return { isValid: true, errors: [] };
    });
    return this;
  }

  positive() {
    this.rules.push((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true, errors: [] };
      }
      if (value <= 0) {
        const message = 'Number must be positive';
        return {
          isValid: false,
          message,
          errors: [message]
        };
      }
      return { isValid: true, errors: [] };
    });
    return this;
  }

  negative() {
    this.rules.push((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true, errors: [] };
      }
      if (value >= 0) {
        const message = 'Number must be negative';
        return {
          isValid: false,
          message,
          errors: [message]
        };
      }
      return { isValid: true, errors: [] };
    });
    return this;
  }

  required(message = 'Number is required') {
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

module.exports = NumberValidator; 