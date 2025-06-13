const BaseValidator = require('./BaseValidator');

class IPAddressValidator extends BaseValidator {
  constructor() {
    super();
    this.ipv4Only = false;
    this.ipv6Only = false;
    this.rules.push((value) => this.validateIP(value));
  }

  validateIP(value) {
    if (value === null || value === undefined || value === '') {
      return { isValid: true };
    }

    if (typeof value !== 'string') {
      const message = 'IP address must be a string';
      return {
        isValid: false,
        message
      };
    }

    if (this.ipv4Only) {
      return this.validateIPv4(value);
    }

    if (this.ipv6Only) {
      return this.validateIPv6(value);
    }

    // Try IPv4 first
    const ipv4Result = this.validateIPv4(value);
    if (ipv4Result.isValid) {
      return ipv4Result;
    }

    // Then try IPv6
    return this.validateIPv6(value);
  }

  validateIPv4(value) {
    const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = value.match(ipv4Pattern);

    if (!match) {
      const message = 'Invalid IPv4 address format';
      return {
        isValid: false,
        message
      };
    }

    for (let i = 1; i <= 4; i++) {
      const octet = match[i];
      // Проверка ведущих нулей
      if (octet.length > 1 && octet[0] === '0') {
        const message = 'Invalid IPv4 address format';
        return {
          isValid: false,
          message
        };
      }
      const num = parseInt(octet, 10);
      if (num < 0 || num > 255) {
        const message = 'Invalid IPv4 address: octet must be between 0 and 255';
        return {
          isValid: false,
          message
        };
      }
    }

    return { isValid: true };
  }

  validateIPv6(value) {
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$/;

    // Проверка на двойное ::
    if ((value.match(/::/g) || []).length > 1) {
      const message = 'Invalid IP address format';
      return {
        isValid: false,
        message
      };
    }

    if (!ipv6Pattern.test(value)) {
      const message = 'Invalid IP address format';
      return {
        isValid: false,
        message
      };
    }

    return { isValid: true };
  }

  ipv4() {
    this.ipv4Only = true;
    this.ipv6Only = false;
    return this;
  }

  ipv6() {
    this.ipv4Only = false;
    this.ipv6Only = true;
    return this;
  }

  required(message = 'IP address is required') {
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

module.exports = IPAddressValidator; 