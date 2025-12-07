import { capitalize } from './text.functions';

describe('shared-utils: capitalize', () => {
  it('should capitalize first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should return empty string for empty input', () => {
    expect(capitalize('')).toBe('');
  });

  it('should return empty string for null', () => {
    expect(capitalize(null as any)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(capitalize(undefined as any)).toBe('');
  });

  it('should keep already capitalized string', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('should handle single character', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('should keep rest of the string unchanged', () => {
    expect(capitalize('hELLO')).toBe('HELLO');
  });

  it('should handle string with spaces', () => {
    expect(capitalize('hello world')).toBe('Hello world');
  });

  it('should handle string starting with number', () => {
    expect(capitalize('123abc')).toBe('123abc');
  });
});
