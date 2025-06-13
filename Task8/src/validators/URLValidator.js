const StringValidator = require('./StringValidator');

class URLValidator extends StringValidator {
  constructor() {
    super();
    // Удаляем базовую проверку типа из StringValidator
    this.rules = this.rules.filter(rule => rule.name !== 'typeCheck');
    // Добавляем свою проверку типа
    this.rules.unshift(this.typeCheck);

    // URL regex with protocol validation
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    this.rules.push((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true };
      }
      if (!urlRegex.test(value)) {
        return {
          isValid: false,
          message: 'Invalid URL format'
        };
      }
      return { isValid: true };
    });
  }

  typeCheck(value) {
    if (value === null || value === undefined || value === '') {
      return { isValid: true };
    }
    if (typeof value !== 'string') {
      return {
        isValid: false,
        message: 'Value must be a string'
      };
    }
    return { isValid: true };
  }

  // Allow specific protocols
  protocols(protocols) {
    const protocolRegex = new RegExp(`^(${protocols.join('|')}):\/\/`);
    this.rules.push((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true };
      }
      if (!protocolRegex.test(value)) {
        return {
          isValid: false,
          message: `URL must use one of the following protocols: ${protocols.join(', ')}`
        };
      }
      return { isValid: true };
    });
    return this;
  }

  required(message = 'URL is required') {
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

module.exports = URLValidator; 