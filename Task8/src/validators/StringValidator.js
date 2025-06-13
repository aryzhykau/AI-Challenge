const BaseValidator = require('./BaseValidator');

class StringValidator extends BaseValidator {
  constructor() {
    super();
    this.rules.push(this.typeCheck);
  }

  typeCheck(value) {
    if (value === null || value === undefined || value === '') {
      return { isValid: true, errors: [] };
    }
    if (typeof value !== 'string') {
      const message = 'Value must be a string';
      return {
        isValid: false,
        message,
        errors: [message]
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
        const message = `String must be at least ${length} characters long`;
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
        const message = `String must be at most ${length} characters long`;
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

  pattern(regex) {
    this.rules.push((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true, errors: [] };
      }
      if (!regex.test(value)) {
        const message = 'String does not match required pattern';
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

  required(message = 'String is required') {
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

module.exports = StringValidator; 