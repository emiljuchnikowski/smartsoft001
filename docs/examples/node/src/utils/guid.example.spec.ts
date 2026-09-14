import { createId } from './guid.example';

const GUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe('docs-examples-node: createId', () => {
  it('should return a value in GUID format', () => {
    const id = createId();

    expect(id).toMatch(GUID_PATTERN);
  });

  it('should return a different value on every call', () => {
    const first = createId();
    const second = createId();

    expect(first).not.toBe(second);
  });
});
