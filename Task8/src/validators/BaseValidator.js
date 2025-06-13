class BaseValidator {
  constructor() {
    this.rules = [];
    this.isRequired = false;
    this.customMessage = undefined;
    this.requiredMessage = 'Value is required';
  }

  addRule(rule) {
    if (typeof rule === 'function') {
      this.rules.push(rule);
    } else if (rule && typeof rule.validate === 'function') {
      this.rules.push(value => {
        const result = rule.validate(value);
        return {
          isValid: result,
          message: rule.message,
        };
      });
    } else {
      throw new Error(
        'Rule must be a function or an object with validate and message properties',
      );
    }
    return this;
  }

  validate(value) {
    const errors = [];

    if (!this.isRequired && (value === null || value === undefined || value === '')) {
      return { isValid: true, errors: [] };
    }

    if (this.isRequired && (value === null || value === undefined || value === '')) {
      errors.push(this.customMessage || this.requiredMessage);
      return { isValid: false, errors };
    }

    for (const rule of this.rules) {
      const result = rule(value);
      if (result && !result.isValid) {
        if (this.customMessage) {
          errors.push(this.customMessage);
          // If there's a custom message, we can often stop at the first error.
          return { isValid: false, errors };
        }
        if (result.errors) {
          errors.push(...result.errors);
        } else if(result.message) {
          errors.push(result.message)
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  required(message) {
    this.isRequired = true;
    if (message) {
      this.requiredMessage = message;
    }
    return this;
  }

  optional() {
    this.isRequired = false;
    return this;
  }

  withMessage(message) {
    this.customMessage = message;
    return this;
  }
}

module.exports = BaseValidator; 