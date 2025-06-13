const StringValidator = require('./validators/StringValidator');
const NumberValidator = require('./validators/NumberValidator');
const BooleanValidator = require('./validators/BooleanValidator');
const DateValidator = require('./validators/DateValidator');
const ObjectValidator = require('./validators/ObjectValidator');
const ArrayValidator = require('./validators/ArrayValidator');
const EmailValidator = require('./validators/EmailValidator');
const PhoneValidator = require('./validators/PhoneValidator');
const URLValidator = require('./validators/URLValidator');
const IPAddressValidator = require('./validators/IPAddressValidator');
const CreditCardValidator = require('./validators/CreditCardValidator');
const PasswordValidator = require('./validators/PasswordValidator');
const ColorValidator = require('./validators/ColorValidator');

// Schema Builder
class Schema {
  static string() {
    return new StringValidator();
  }
  
  static number() {
    return new NumberValidator();
  }
  
  static boolean() {
    return new BooleanValidator();
  }
  
  static date() {
    return new DateValidator();
  }
  
  static object(schema) {
    return new ObjectValidator(schema);
  }
  
  static array(itemValidator) {
    return new ArrayValidator(itemValidator);
  }

  static email() {
    return new EmailValidator();
  }

  static phone() {
    return new PhoneValidator();
  }

  static url() {
    return new URLValidator();
  }

  static ipAddress() {
    return new IPAddressValidator();
  }

  static creditCard() {
    return new CreditCardValidator();
  }

  static password() {
    return new PasswordValidator();
  }

  static color() {
    return new ColorValidator();
  }
}

module.exports = { Schema };
