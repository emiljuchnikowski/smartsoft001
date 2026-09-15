import { isActive } from './specification.example';

describe('docs-examples-node: isActive', () => {
  it('should accept an item matching the criteria', () => {
    const result = isActive({ id: 'u-1', status: 'active' });

    expect(result).toBe(true);
  });

  it('should reject an item with another status', () => {
    const result = isActive({ id: 'u-2', status: 'blocked' });

    expect(result).toBe(false);
  });
});
