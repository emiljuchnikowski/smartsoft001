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

  it('should handle multiple consecutive entities', () => {
    const result = RemoveHtmlService.create('&amp;&amp;&amp;');
    expect(result).toBe('&&&');
  });

  it('should handle mixed entities in sequence', () => {
    const result = RemoveHtmlService.create('&nbsp;&quot;&apos;&lt;&gt;&amp;');
    expect(result).toBe(' "\'<>&');
  });

  it('should handle HTML comments', () => {
    const result = RemoveHtmlService.create('Text<!-- comment -->More');
    expect(result).toBe('TextMore');
  });

  it('should handle script tags', () => {
    const result = RemoveHtmlService.create(
      'Text<script>alert("xss")</script>More',
    );
    expect(result).toBe('Textalert("xss")More');
  });

  it('should handle style tags', () => {
    const result = RemoveHtmlService.create(
      'Text<style>body { color: red; }</style>More',
    );
    expect(result).toBe('Textbody { color: red; }More');
  });

  it('should handle unclosed tags', () => {
    const result = RemoveHtmlService.create('<p>Unclosed paragraph');
    expect(result).toBe('Unclosed paragraph');
  });

  it('should handle tags with newlines in attributes', () => {
    const result = RemoveHtmlService.create(
      '<div class="test"\n  id="element">Content</div>',
    );
    expect(result).toBe('Content');
  });

  it('should handle &copy; and &reg; entities', () => {
    const result = RemoveHtmlService.create('&copy; 2024 &reg;');
    expect(result).toBe(' 2024 ');
  });

  it('should handle &euro; entity', () => {
    const result = RemoveHtmlService.create('Price: &#8364; 100');
    expect(result).toBe('Price: € 100');
  });

  it('should handle &pound; entity', () => {
    const result = RemoveHtmlService.create('Price: &#163; 50');
    expect(result).toBe('Price: £ 50');
  });

  it('should handle consecutive HTML tags without spaces', () => {
    const result = RemoveHtmlService.create('<p>Hello</p><p>World</p>');
    expect(result).toBe('HelloWorld');
  });

  it('should handle HTML tags with inline styles', () => {
    const result = RemoveHtmlService.create(
      '<span style="color: red; font-size: 16px;">Styled text</span>',
    );
    expect(result).toBe('Styled text');
  });

  it('should handle deeply nested HTML', () => {
    const result = RemoveHtmlService.create(
      '<div><section><article><p><span>Deep content</span></p></article></section></div>',
    );
    expect(result).toBe('Deep content');
  });

  it('should handle mixed Polish characters and entities', () => {
    const result = RemoveHtmlService.create(
      'Artykuł &quot;Zażółć&quot; &nbsp; &copy; 2024',
    );
    expect(result).toBe('Artykuł "Zażółć"    2024');
  });

  it('should handle tabs and multiple spaces', () => {
    const result = RemoveHtmlService.create('<p>Text\twith\t\ttabs</p>');
    expect(result).toBe('Text\twith\t\ttabs');
  });

  it('should handle &curren; and &cent; entities', () => {
    const result = RemoveHtmlService.create('&#164; &#162;');
    expect(result).toBe('¤ ¢');
  });

  it('should handle empty tags', () => {
    const result = RemoveHtmlService.create('Before<div></div>After');
    expect(result).toBe('BeforeAfter');
  });

  it('should handle attributes with special characters', () => {
    const result = RemoveHtmlService.create(
      '<img alt="&quot;quoted&quot;" src="test.jpg" />Image',
    );
    expect(result).toBe('Image');
  });

  it('should handle incomplete numeric entities', () => {
    const result = RemoveHtmlService.create('Test &#65 incomplete');
    expect(result).toBe('Test &#65 incomplete');
  });
});
