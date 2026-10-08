import type { ReactNode } from 'react';

export type IconName = 'spinner' | 'chevron-down' | 'chevron-up';

export interface SmartIconGlyphProps {
  className?: string;
}

export interface SmartIconProps {
  name?: IconName;
  className?: string;
  /** Rendered instead of the named glyph (the Angular `template` input). */
  template?: ReactNode;
}
