const BaseValidator = require('./BaseValidator');

class ObjectValidator extends BaseValidator {
  constructor(schema) {
    super();
    this.schema = schema;
    this.rules.push((value) => this.validateObject(value));
  }

  validateObject(value) {
    if (value === null || value === undefined || value === '') {
      return { isValid: true, errors: [] };
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      const message = 'Value must be an object';
      return {
        isValid: false,
        message,
        errors: [message]
      };
    }

    const errors = [];
    for (const [key, validator] of Object.entries(this.schema)) {
      if (!(key in value)) {
        if (validator.isRequired) {
          errors.push(`${key}: Value is required`);
        }
        continue;
      }

      const result = validator.validate(value[key]);
      if (!result.isValid) {
        errors.push(`${key}: ${result.message}`);
      }
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        message: errors.join(', '),
        errors
      };
    }

    return { isValid: true, errors: [] };
  }

  required(message) {
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

module.exports = ObjectValidator; 