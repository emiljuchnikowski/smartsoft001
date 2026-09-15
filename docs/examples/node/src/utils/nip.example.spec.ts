import { isValidNip } from './nip.example';

describe('docs-examples-node: isValidNip', () => {
  it('should accept a number with a correct checksum', () => {
    const result = isValidNip('5372527048');

    expect(result).toBe(true);
  });

  it('should accept a number written with separators', () => {
    const result = isValidNip('537-252-70-48');

    expect(result).toBe(true);
  });

  it('should reject a number with a wrong checksum', () => {
    const result = isValidNip('5372527041');

    expect(result).toBe(false);
  });
});
