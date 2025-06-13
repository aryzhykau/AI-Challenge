const BaseValidator = require('./BaseValidator');

class DateValidator extends BaseValidator {
  constructor() {
    super();
    this.rules.push(this.typeCheck);
  }

  typeCheck(value) {
    if (value === null || value === undefined || value === '') {
      return { isValid: true, errors: [] };
    }
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      const message = 'Value must be a valid Date object';
      return {
        isValid: false,
        message,
        errors: [message]
      };
    }
    return { isValid: true, errors: [] };
  }

  min(minDate) {
    this.rules.push((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true, errors: [] };
      }
      if (value < minDate) {
        const message = `Date must be after ${minDate.toISOString()}`;
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

  max(maxDate) {
    this.rules.push((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true, errors: [] };
      }
      if (value > maxDate) {
        const message = `Date must be before ${maxDate.toISOString()}`;
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

  required(message = 'Date is required') {
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

module.exports = DateValidator; 