## Enigma.js Bug Fixes

This document details two critical bugs found in `enigma.js` and the corresponding fixes.

### 1. Incorrect Rotor Stepping Mechanism

**The Bug:**

The original implementation of the `stepRotors` method did not correctly model the historical behavior of the Enigma machine's rotor stepping mechanism, specifically the "double step" anomaly. 

In a real Enigma, the middle rotor advances under two conditions:
1. When the right rotor is at its notch position.
2. When the middle rotor *itself* is at its notch position (this causes the left rotor to advance as well).

The original code only handled the first condition. It failed to advance the middle rotor when it was at its own notch, leading to incorrect rotor configurations after the step and thus, incorrect encryption. For example, a rotor sequence of `A-E-U` would incorrectly step to `B-E-V` instead of the correct `B-F-V`.

**The Fix:**

The `stepRotors` function was rewritten to accurately model the correct behavior. The new logic first checks if the middle rotor is at its notch. If it is, both the left and middle rotors are advanced. This is the "double step". If the middle rotor is not at its notch, the code then checks if the right rotor is at its notch, advancing only the middle rotor if true. The rightmost rotor always advances on every step. This ensures the stepping logic is consistent with the machine's historical design.

### 2. Missing Final Plugboard Swap

**The Bug:**

The electrical path in an Enigma machine sends the signal through the plugboard (if any pairs are connected) both at the very beginning and at the very end of the process for a single character. The original `encryptChar` function only performed the plugboard swap at the beginning of the encryption, before the signal entered the rotors. It was missing the second, final swap after the signal had passed back through the rotors and the reflector.

**The Fix:**

The fix was simple: a second call to `plugboardSwap(c, this.plugboardPairs)` was added to the end of the `encryptChar` function, just before the character is returned. This ensures the character is correctly swapped according to the plugboard settings at both ends of the encryption path, producing the correct ciphertext.

### 3. Incorrect Rotor Wiring Signal Path

**The Bug:**

This was the most critical bug, causing all encryption tests to fail. The original `forward` and `backward` methods in the `Rotor` class did not correctly model the path of the electrical signal. The signal should be offset by the rotor's position and ring setting on its way *in* to the static wiring, and then the signal should be offset again on its way *out*.

The original code only performed the initial offset, completely omitting the second offset on the output. This fundamentally broke the encryption logic and produced incorrect results for every character.

**The Fix:**

Both `forward` and `backward` methods were rewritten. The new implementation correctly calculates an `entryOffset` based on the rotor's position and ring setting. This offset is applied to the character index before it passes through the rotor's wiring (`this.wiring`). After the character is substituted by the wiring, the same offset is subtracted from the output character's index. This two-way offset correctly models the physical behavior of a real Enigma rotor, which was the key to fixing the widespread test failures. 