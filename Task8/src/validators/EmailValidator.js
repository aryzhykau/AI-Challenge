const StringValidator = require('./StringValidator');

class EmailValidator extends StringValidator {
  constructor() {
    super();
    // Удаляем базовую проверку типа из StringValidator
    this.rules = this.rules.filter(rule => rule.name !== 'typeCheck');
    // Добавляем свою проверку типа
    this.rules.unshift(this.typeCheck);

    // RFC 5322 compliant email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    this.rules.push((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true, errors: [] };
      }
      if (!emailRegex.test(value)) {
        const message = 'Invalid email format';
        return {
          isValid: false,
          message,
          errors: [message]
        };
      }
      return { isValid: true, errors: [] };
    });
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

  required(message = 'Email is required') {
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

module.exports = EmailValidator; 