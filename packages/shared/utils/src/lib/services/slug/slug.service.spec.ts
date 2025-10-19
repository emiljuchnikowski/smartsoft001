import { SlugService } from './slug.service';

describe('shared-utils: SlugService', () => {
  it('should convert Polish characters to English equivalents', () => {
    const result = SlugService.create('Zażółć gęślą jaźń');
    expect(result).toBe('zazolc-gesla-jazn');
  });

  it('should convert uppercase Polish characters', () => {
    const result = SlugService.create('ĄĆĘŁŃÓŚŹŻ');
    expect(result).toBe('acelnoszz');
  });

  it('should replace spaces with hyphens', () => {
    const result = SlugService.create('hello world test');
    expect(result).toBe('hello-world-test');
  });

  it('should replace special characters with hyphens', () => {
    const result = SlugService.create('hello@world!test#2024');
    expect(result).toBe('hello-world-test-2024');
  });

  it('should remove multiple consecutive hyphens', () => {
    const result = SlugService.create('hello   world!!!test');
    expect(result).toBe('hello-world-test');
  });

  it('should trim hyphens from start and end', () => {
    const result = SlugService.create('  hello world  ');
    expect(result).toBe('hello-world');
  });

  it('should handle mixed Polish and English text', () => {
    const result = SlugService.create('Programowanie w języku TypeScript');
    expect(result).toBe('programowanie-w-jezyku-typescript');
  });

  it('should return empty string for empty input', () => {
    const result = SlugService.create('');
    expect(result).toBe('');
  });

  it('should handle numbers correctly', () => {
    const result = SlugService.create('Test 123 Project 2024');
    expect(result).toBe('test-123-project-2024');
  });

  it('should handle complex special characters', () => {
    const result = SlugService.create('Product (New) - 50% OFF!');
    expect(result).toBe('product-new-50-off');
  });

  it('should handle all Polish characters in one string', () => {
    const result = SlugService.create('ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ');
    expect(result).toBe('acelnoszz-acelnoszz');
  });
});