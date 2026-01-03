import { RemoveHtmlService } from '../remove-html/remove-html.service';

export class SlugService {
  private static readonly polishToEnglishMap: Record<string, string> = {
    ą: 'a',
    ć: 'c',
    ę: 'e',
    ł: 'l',
    ń: 'n',
    ó: 'o',
    ś: 's',
    ź: 'z',
    ż: 'z',
    Ą: 'A',
    Ć: 'C',
    Ę: 'E',
    Ł: 'L',
    Ń: 'N',
    Ó: 'O',
    Ś: 'S',
    Ź: 'Z',
    Ż: 'Z',
  };

  /**
   * Convert text to URL-friendly slug
   * - Removes HTML tags and entities
   * - Replaces Polish characters with English equivalents
   * - Converts to lowercase
   * - Replaces spaces and special characters with hyphens
   * - Removes multiple consecutive hyphens
   * - Trims hyphens from start and end
   */
  static create(text: string | undefined | null): string {
    if (!text) {
      return '';
    }

    // Remove HTML tags and decode HTML entities
    let slug = RemoveHtmlService.create(text);

    // Replace Polish characters with English equivalents
    slug = slug
      .split('')
      .map((char) => SlugService.polishToEnglishMap[char] || char)
      .join('');

    // Convert to lowercase
    slug = slug.toLowerCase();

    // Replace spaces and special characters with hyphens
    slug = slug.replace(/[^a-z0-9]+/g, '-');

    // Remove multiple consecutive hyphens
    slug = slug.replace(/-+/g, '-');

    // Trim hyphens from start and end
    slug = slug.replace(/^-+|-+$/g, '');

    return slug;
  }
}
