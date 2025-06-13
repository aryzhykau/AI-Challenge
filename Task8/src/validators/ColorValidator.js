const BaseValidator = require('./BaseValidator');

class ColorValidator extends BaseValidator {
  constructor() {
    super();
    this.allowedModes = ['HEX', 'RGB', 'RGBA', 'HSL'];
    this.activeModes = [...this.allowedModes];
    this.rules.push((value) => this.validateColor(value));
  }

  validateColor(value) {
    if (value === null || value === undefined || value === '') {
      return { isValid: true };
    }

    if (typeof value !== 'string') {
      return {
        isValid: false,
        message: 'Color must be a string'
      };
    }

    // HEX validation
    if (this.activeModes.includes('HEX')) {
      const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (hexPattern.test(value)) {
        return { isValid: true };
      }
    }

    // RGB validation
    if (this.activeModes.includes('RGB')) {
      const rgbPattern = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
      const rgbMatch = value.match(rgbPattern);
      if (rgbMatch) {
        const [, r, g, b] = rgbMatch;
        if ([r, g, b].every(num => parseInt(num, 10) >= 0 && parseInt(num, 10) <= 255)) {
          return { isValid: true };
        }
        return {
          isValid: false,
          message: 'RGB values must be between 0 and 255'
        };
      }
    }

    // RGBA validation
    if (this.activeModes.includes('RGBA')) {
      const rgbaPattern = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/;
      const rgbaMatch = value.match(rgbaPattern);
      if (rgbaMatch) {
        const [, r, g, b, a] = rgbaMatch;
        if ([r, g, b].every(num => parseInt(num, 10) >= 0 && parseInt(num, 10) <= 255)) {
          const alpha = parseFloat(a);
          if (alpha >= 0 && alpha <= 1) {
            return { isValid: true };
          }
          return {
            isValid: false,
            message: 'Alpha value must be between 0 and 1'
          };
        }
        return {
          isValid: false,
          message: 'RGB values must be between 0 and 255'
        };
      }
    }

    // HSL validation
    if (this.activeModes.includes('HSL')) {
      const hslPattern = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;
      const hslMatch = value.match(hslPattern);
      if (hslMatch) {
        const [, h, s, l] = hslMatch;
        if (parseInt(h, 10) >= 0 && parseInt(h, 10) <= 360 &&
            parseInt(s, 10) >= 0 && parseInt(s, 10) <= 100 &&
            parseInt(l, 10) >= 0 && parseInt(l, 10) <= 100) {
          return { isValid: true };
        }
        return {
          isValid: false,
          message: 'HSL values out of range'
        };
      }
    }

    return {
      isValid: false,
      message: 'Must be a valid color (HEX, RGB, RGBA, or HSL)'
    };
  }

  modesAllowed(modes) {
    if (!Array.isArray(modes)) {
      throw new Error('Modes must be an array');
    }
    const invalidModes = modes.filter(mode => !this.allowedModes.includes(mode.toUpperCase()));
    if (invalidModes.length > 0) {
      throw new Error(`Invalid color modes: ${invalidModes.join(', ')}`);
    }
    this.activeModes = modes.map(mode => mode.toUpperCase());
    return this;
  }

  required(message = 'Color is required!') {
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

module.exports = ColorValidator; 