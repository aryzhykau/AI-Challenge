const StringValidator = require('./StringValidator');

class PhoneValidator extends StringValidator {
  constructor() {
    super();
    // E.164 international phone number format: +1234567890 (от 1 до 15 цифр после плюса)
    const phoneRegex = /^\+?[1-9]\d{0,14}$/;
    this.rules.push((value) => {
      if (!phoneRegex.test(value)) {
        return {
          isValid: false,
          message: 'Invalid phone number format'
        };
      }
      return { isValid: true };
    });
  }
}

module.exports = PhoneValidator; 