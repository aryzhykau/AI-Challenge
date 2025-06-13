const StringValidator = require('./StringValidator');

class CreditCardValidator extends StringValidator {
  constructor() {
    super();
    // Удаляем базовую проверку типа из StringValidator
    this.rules = this.rules.filter(rule => rule.name !== 'typeCheck');
    // Добавляем свою проверку типа
    this.rules.unshift(this.typeCheck);

    // Базовые регулярные выражения для разных типов карт
    this.cardPatterns = {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
      jcb: /^(?:2131|1800|35\d{3})\d{11}$/
    };

    this.rules.push((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true };
      }

      // Удаляем все нецифровые символы
      const cleanNumber = value.replace(/\D/g, '');
      
      // Проверяем длину (должно быть от 13 до 19 цифр)
      if (cleanNumber.length < 13 || cleanNumber.length > 19) {
        return {
          isValid: false,
          message: 'Invalid credit card number length'
        };
      }

      // Проверяем алгоритм Луна
      if (!this.luhnCheck(cleanNumber)) {
        return {
          isValid: false,
          message: 'Invalid credit card number'
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

  // Алгоритм Луна для проверки номера карты
  luhnCheck(value) {
    let sum = 0;
    let isEven = false;
    
    // Идем с конца номера
    for (let i = value.length - 1; i >= 0; i--) {
      let digit = parseInt(value.charAt(i));

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return (sum % 10) === 0;
  }

  // Проверка конкретного типа карты
  type(cardType) {
    if (!this.cardPatterns[cardType]) {
      throw new Error(`Unsupported card type: ${cardType}`);
    }

    this.rules.push((value) => {
      if (value === null || value === undefined || value === '') {
        return { isValid: true };
      }

      const cleanNumber = value.replace(/\D/g, '');
      if (!this.cardPatterns[cardType].test(cleanNumber)) {
        return {
          isValid: false,
          message: `Must be a valid ${cardType} card number`
        };
      }
      return { isValid: true };
    });
    return this;
  }

  required(message = 'Credit card number is required') {
    this.rules = this.rules.filter(rule => !rule.__isRequiredRule);
    const requiredRule = (value) => {
      if (value === null || value === undefined || value === '') {
        return {
          isValid: false,
          message
        };
      }
      return { isValid: true };
    };
    requiredRule.__isRequiredRule = true;
    this.rules.unshift(requiredRule);
    return this;
  }

  validate(value) {
    const requiredRule = this.rules.find(rule => rule.__isRequiredRule);
    if (requiredRule) {
      const result = requiredRule(value);
      if (!result.isValid) {
        return {
          isValid: false,
          message: result.message
        };
      }
    }
    if ((value === null || value === undefined || value === '') && !requiredRule) {
      return { isValid: true };
    }
    for (const rule of this.rules) {
      if (rule.__isRequiredRule) continue;
      const result = rule(value);
      if (!result.isValid) {
        return {
          isValid: false,
          message: result.message
        };
      }
    }
    return { isValid: true };
  }
}

module.exports = CreditCardValidator; 