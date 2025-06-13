const BaseValidator = require('./BaseValidator');

class BooleanValidator extends BaseValidator {
  constructor() {
    super();
    this.rules.push(this.typeCheck);
  }

  typeCheck(value) {
    if (value === null || value === undefined || value === '') {
      return { isValid: true, errors: [] };
    }
    if (typeof value !== 'boolean') {
      const message = 'Value must be a boolean';
      return {
        isValid: false,
        message,
        errors: [message]
      };
    }
    return { isValid: true, errors: [] };
  }

  required(message = 'Boolean is required') {
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

module.exports = BooleanValidator; 