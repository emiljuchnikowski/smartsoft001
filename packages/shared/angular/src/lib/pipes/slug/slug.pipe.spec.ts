import { SlugPipe } from './slug.pipe';

describe('shared-angular: SlugPipe', () => {
  let pipe: SlugPipe;

  beforeEach(() => {
    pipe = new SlugPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should convert Polish characters to slug', () => {
    const result = pipe.transform('Zażółć gęślą jaźń');
    expect(result).toBe('zazolc-gesla-jazn');
  });

  it('should convert text with spaces to slug', () => {
    const result = pipe.transform('Hello World Test');
    expect(result).toBe('hello-world-test');
  });

  it('should handle special characters', () => {
    const result = pipe.transform('Product (New) - 50% OFF!');
    expect(result).toBe('product-new-50-off');
  });

  it('should handle mixed Polish and English text', () => {
    const result = pipe.transform('Programowanie w języku TypeScript');
    expect(result).toBe('programowanie-w-jezyku-typescript');
  });

  it('should return empty string for empty input', () => {
    const result = pipe.transform('');
    expect(result).toBe('');
  });

  it('should handle numbers correctly', () => {
    const result = pipe.transform('Test 123 Project 2024');
    expect(result).toBe('test-123-project-2024');
  });
});