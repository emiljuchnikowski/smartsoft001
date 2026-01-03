export class RemoveHtmlService {
  /**
   * Remove HTML tags and decode HTML entities from text
   * - Removes HTML tags
   * - Decodes common named entities (&nbsp;, &quot;, etc.)
   * - Decodes numeric entities (&#123; or &#xAB;)
   * - Removes any remaining unrecognized entities
   */
  static create(val: string | undefined | null): string {
    if (!val) {
      return '';
    }

    let result = val;

    // Remove HTML tags
    result = result.replace(/<[^>]*(>|$)/g, '');

    // Decode common named entities
    result = result
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&bdquo;/g, '„')
      .replace(/&rdquo;/g, '"')
      .replace(/&ldquo;/g, '"')
      .replace(/&laquo;/g, '«')
      .replace(/&raquo;/g, '»')
      .replace(/&zwnj;/g, '');

    // Decode numeric entities (&#123; or &#xAB;)
    result = result
      .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
      .replace(/&#x([0-9a-f]+);/gi, (match, hex) =>
        String.fromCharCode(parseInt(hex, 16)),
      );

    // Remove any remaining unrecognized entities
    result = result.replace(/&[a-z]+;/gi, '');

    return result;
  }
}
