const {
  Enigma,
  Rotor,
  plugboardSwap,
  mod,
  alphabet,
} = require('./enigma');

describe('Enigma Machine Components', () => {
  test('mod function should handle positive and negative numbers', () => {
    expect(mod(10, 26)).toBe(10);
    expect(mod(26, 26)).toBe(0);
    expect(mod(-1, 26)).toBe(25);
    expect(mod(-27, 26)).toBe(25);
  });

  test('plugboardSwap should swap letters correctly', () => {
    const pairs = [
      ['A', 'B'],
      ['C', 'D'],
    ];
    expect(plugboardSwap('A', pairs)).toBe('B');
    expect(plugboardSwap('B', pairs)).toBe('A');
    expect(plugboardSwap('C', pairs)).toBe('D');
    expect(plugboardSwap('E', pairs)).toBe('E');
    expect(plugboardSwap('Z', [])).toBe('Z');
  });

  describe('Rotor', () => {
    const rotorI = new Rotor(
      'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
      'Q',
      0 /*ring*/,
      0 /*pos*/,
    );

    test('step should advance position', () => {
      rotorI.step();
      expect(rotorI.position).toBe(1);
      rotorI.position = 25;
      rotorI.step();
      expect(rotorI.position).toBe(0);
    });

    test('atNotch should be true at notch position', () => {
      rotorI.position = 16; // 'Q'
      expect(rotorI.atNotch()).toBe(true);
      rotorI.position = 17;
      expect(rotorI.atNotch()).toBe(false);
    });

    test('forward pass should encrypt correctly', () => {
      // With position 0, ring 0, 'A' -> 'E'
      rotorI.position = 0;
      rotorI.ringSetting = 0;
      expect(rotorI.forward('A')).toBe('E');
      // With position 1, ring 0, 'A' -> 'J'
      rotorI.position = 1;
      expect(rotorI.forward('A')).toBe('J');
    });

    test('backward pass should decrypt correctly', () => {
      rotorI.position = 0;
      rotorI.ringSetting = 0;
      expect(rotorI.backward('E')).toBe('A');
      rotorI.position = 1;
      expect(rotorI.backward('J')).toBe('A');
    });
  });
});

describe('Enigma Machine Integration', () => {
  test('should encrypt a single character correctly', () => {
    const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    // Stepping to [0,0,1] before encryption
    expect(enigma.encryptChar('A')).toBe('B');
  });

  test('should process a full message correctly without plugs', () => {
    const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const message = 'HELLOWORLD';
    const expected = 'ILBDAAMTAZ';
    expect(enigma.process(message)).toBe(expected);
  });

  test('should process a full message correctly with plugs', () => {
    const plugPairs = [
      ['A', 'B'],
      ['C', 'D'],
    ];
    const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], plugPairs);
    const message = 'HELLOWORLD';
    const expected = 'ILACBBMTBE';
    expect(enigma.process(message)).toBe(expected);
  });

  test('should return non-alphabetic characters unchanged', () => {
    const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    expect(enigma.process('HELLO WORLD!')).toBe('ILBDA AMTAZ!');
  });

  test('decryption is encryption', () => {
    const enigma = new Enigma([0, 1, 2], [5, 12, 21], [1, 2, 3], [
      ['Q', 'E'],
    ]);
    const message = 'TESTING';
    const encrypted = enigma.process(message);
    const enigma2 = new Enigma([0, 1, 2], [5, 12, 21], [1, 2, 3], [
      ['Q', 'E'],
    ]);
    const decrypted = enigma2.process(encrypted);
    expect(decrypted).toBe(message);
  });

  describe('Rotor Stepping Logic', () => {
    test('right rotor should step every time', () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      enigma.stepRotors();
      expect(enigma.rotors[2].position).toBe(1);
    });

    test('middle rotor should step when right rotor is at notch', () => {
      // Rotor III (index 2) has notch 'V' (pos 21)
      const enigma = new Enigma([0, 1, 2], [0, 0, 21], [0, 0, 0], []);
      enigma.stepRotors();
      expect(enigma.rotors[1].position).toBe(1); // Middle rotor steps
      expect(enigma.rotors[2].position).toBe(22); // Right rotor steps
    });

    test('left and middle rotors should step when middle is at notch (double step)', () => {
      // Rotor II (index 1) has notch 'E' (pos 4)
      const enigma = new Enigma([0, 1, 2], [0, 4, 10], [0, 0, 0], []);
      enigma.stepRotors();
      expect(enigma.rotors[0].position).toBe(1); // Left rotor steps
      expect(enigma.rotors[1].position).toBe(5); // Middle rotor steps
      expect(enigma.rotors[2].position).toBe(11); // Right rotor steps
    });

    test('should correctly encrypt a known long string', () => {
      // This test provides a reliable validation of the entire mechanism,
      // including the complex stepping logic over a long input.
      const enigma = new Enigma(
        [0, 1, 2], // I, II, III
        [0, 0, 0], // A, A, A
        [0, 0, 0], // rings A,A,A (0,0,0)
        [],
      );
      // Encrypting 20 'A's is a standard test vector.
      const plaintext = 'AAAAAAAAAAAAAAAAAAAA';
      const ciphertext = 'BDZGOWCXLTKSBTMCDLPB';
      expect(enigma.process(plaintext)).toBe(ciphertext);
    });
  });
}); 