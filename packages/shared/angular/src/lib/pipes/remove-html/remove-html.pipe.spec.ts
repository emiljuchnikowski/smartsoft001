import { RemoveHtmlPipe } from './remove-html.pipe';

describe('RemoveHtmlPipe', () => {
  let pipe: RemoveHtmlPipe;

  beforeEach(() => {
    pipe = new RemoveHtmlPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should remove HTML tags', () => {
    const result = pipe.transform('<p>Hello <strong>World</strong></p>');
    expect(result).toBe('Hello World');
  });

  it('should decode HTML entities', () => {
    const result = pipe.transform('Hello&nbsp;World');
    expect(result).toBe('Hello World');
  });

  it('should decode numeric entities', () => {
    const result = pipe.transform('&#65;&#66;C');
    expect(result).toBe('ABC');
  });

  it('should handle undefined input', () => {
    const result = pipe.transform(undefined);
    expect(result).toBe('');
  });

  it('should handle null input', () => {
    const result = pipe.transform(null);
    expect(result).toBe('');
  });

  it('should handle complex HTML with entities', () => {
    const result = pipe.transform(
      '<p>Test &quot;content&quot; &amp; &#65;</p>',
    );
    expect(result).toBe('Test "content" & A');
  });
});
