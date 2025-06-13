const BaseValidator = require('./BaseValidator');

class ArrayValidator extends BaseValidator {
  constructor(itemValidator) {
    super();
    this.itemValidator = itemValidator;
    this.rules.push((value) => this.validateArray(value));
  }

  validateArray(value) {
    if (value === null || value === undefined || value === '') {
      return { isValid: true, errors: [] };
    }

    if (!Array.isArray(value)) {
      const message = 'Value must be an array';
      return {
        isValid: false,
        message,
        errors: [message]
      };
    }

    const errors = [];
    value.forEach((item, idx) => {
      const result = this.itemValidator.validate(item);
      if (!result.isValid) {
        result.errors.forEach(error => {
          errors.push(`Index ${idx}: ${error}`);
        });
      }
    });

    if (errors.length > 0) {
      return {
        isValid: false,
        message: errors.join(', '),
        errors
      };
    }

    return { isValid: true, errors: [] };
  }

  minLength(length) {
    this.rules.push((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true, errors: [] };
      }
      if (value.length < length) {
        const message = `Array must have at least ${length} items`;
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

  maxLength(length) {
    this.rules.push((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true, errors: [] };
      }
      if (value.length > length) {
        const message = `Array must have at most ${length} items`;
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

module.exports = ArrayValidator; 