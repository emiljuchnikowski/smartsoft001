import DOMPurify from 'dompurify';

import { RemoveHtmlService } from '@smartsoft001/utils';

const TRUSTED = Symbol.for('smartsoft:trusted-html');

/**
 * HTML the application vouches for, rendered as is. The React counterpart of
 * returning `SafeHtml` from `DomSanitizer.bypassSecurityTrustHtml`.
 */
export interface SmartTrustedHtml {
  readonly [TRUSTED]: true;
  readonly html: string;
}

/** Marks `html` as trusted, so the components skip sanitising it. */
export function trustHtml(html: string): SmartTrustedHtml {
  return { [TRUSTED]: true, html } as SmartTrustedHtml;
}

export function isTrustedHtml(value: unknown): value is SmartTrustedHtml {
  return (
    !!value &&
    typeof value === 'object' &&
    (value as Record<symbol, unknown>)[TRUSTED] === true
  );
}

/**
 * Removes everything active from `html`: scripts, event handlers, iframes,
 * SVG and MathML, inline `style` attributes and `javascript:` URLs, keeping
 * the formatting and safe links. This is the protection Angular's sanitizer
 * gave the text details; React renders HTML verbatim, so the components call
 * this before `dangerouslySetInnerHTML`.
 *
 * Without a DOM (server rendering) the markup cannot be parsed safely, so the
 * tags are dropped and the text is escaped.
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';

  if (typeof window === 'undefined' || !DOMPurify.isSupported) {
    return escapeHtml(RemoveHtmlService.create(html));
  }

  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'iframe', 'form', 'object', 'embed'],
    FORBID_ATTR: ['style'],
  });
}

/** The `__html` to render a value with: trusted as is, anything else sanitised. */
export function toInnerHtml(value: unknown): { __html: string } {
  if (isTrustedHtml(value)) return { __html: value.html };

  return {
    __html: sanitizeHtml(
      value === null || value === undefined ? '' : String(value),
    ),
  };
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
