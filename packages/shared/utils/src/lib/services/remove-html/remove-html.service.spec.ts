import { RemoveHtmlService } from './remove-html.service';

describe('shared-utils: RemoveHtmlService', () => {
  it('should remove HTML tags', () => {
    const result = RemoveHtmlService.create(
      '<p>Hello <strong>World</strong></p>',
    );
    expect(result).toBe('Hello World');
  });

  it('should decode &nbsp; entity', () => {
    const result = RemoveHtmlService.create('Hello&nbsp;World');
    expect(result).toBe('Hello World');
  });

  it('should decode &quot; entity', () => {
    const result = RemoveHtmlService.create('&quot;quoted&quot;');
    expect(result).toBe('"quoted"');
  });

  it('should decode &apos; entity', () => {
    const result = RemoveHtmlService.create('don&apos;t');
    expect(result).toBe("don't");
  });

  it('should decode &lt; and &gt; entities', () => {
    const result = RemoveHtmlService.create('&lt;tag&gt;');
    expect(result).toBe('<tag>');
  });

  it('should decode &amp; entity', () => {
    const result = RemoveHtmlService.create('A &amp; B');
    expect(result).toBe('A & B');
  });

  it('should decode &bdquo; entity', () => {
    const result = RemoveHtmlService.create('&bdquo;quoted&rdquo;');
    expect(result).toBe('„quoted"');
  });

  it('should decode &ldquo; and &rdquo; entities', () => {
    const result = RemoveHtmlService.create('&ldquo;Hello&rdquo;');
    expect(result).toBe('"Hello"');
  });

  it('should decode &laquo; and &raquo; entities', () => {
    const result = RemoveHtmlService.create('&laquo;text&raquo;');
    expect(result).toBe('«text»');
  });

  it('should decode decimal numeric entities', () => {
    const result = RemoveHtmlService.create('&#65;&#66;&#67;');
    expect(result).toBe('ABC');
  });

  it('should decode hexadecimal numeric entities', () => {
    const result = RemoveHtmlService.create('&#x41;&#x42;&#x43;');
    expect(result).toBe('ABC');
  });

  it('should handle mixed case hexadecimal entities', () => {
    const result = RemoveHtmlService.create('&#xA9; &#xA9;');
    expect(result).toBe('© ©');
  });

  it('should remove unrecognized entities', () => {
    const result = RemoveHtmlService.create('&unknown; &fake;');
    expect(result).toBe(' ');
  });

  it('should return empty string for empty input', () => {
    const result = RemoveHtmlService.create('');
    expect(result).toBe('');
  });

  it('should handle null input', () => {
    const result = RemoveHtmlService.create(null);
    expect(result).toBe('');
  });

  it('should handle undefined input', () => {
    const result = RemoveHtmlService.create(undefined);
    expect(result).toBe('');
  });

  it('should handle complex HTML with multiple entities', () => {
    const result = RemoveHtmlService.create(
      '<p>Hello &quot;World&quot; &nbsp; &amp; &#65;&#66;C</p>',
    );
    expect(result).toBe('Hello "World"   & ABC');
  });

  it('should handle nested HTML tags', () => {
    const result = RemoveHtmlService.create(
      '<div><p>Nested <strong>content</strong></p></div>',
    );
    expect(result).toBe('Nested content');
  });

  it('should handle HTML with attributes', () => {
    const result = RemoveHtmlService.create(
      '<a href="example.com" class="link">Click here</a>',
    );
    expect(result).toBe('Click here');
  });

  it('should handle self-closing tags', () => {
    const result = RemoveHtmlService.create(
      'Text<br/>More text<img src="test.jpg" />',
    );
    expect(result).toBe('TextMore text');
  });

  it('should handle Polish characters with HTML', () => {
    const result = RemoveHtmlService.create(
      '<p>Zażółć &nbsp; gęślą &quot;jaźń&quot;</p>',
    );
    expect(result).toBe('Zażółć   gęślą "jaźń"');
  });

  it('should handle &zwnj; entity (zero-width non-joiner)', () => {
    const result = RemoveHtmlService.create('test&zwnj;word');
    expect(result).toBe('testword');
  });

  it('should handle whitespace and newlines in HTML', () => {
    const result = RemoveHtmlService.create(
      '<p>\n  Hello\n  <strong>World</strong>\n</p>',
    );
    expect(result).toBe('\n  Hello\n  World\n');
  });
});
