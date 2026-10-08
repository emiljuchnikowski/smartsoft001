import {
  SmartIconChevronDown,
  SmartIconChevronUp,
  SmartIconSpinner,
} from './glyphs';
import { SmartIconProps } from './icon.types';

/** `<smart-icon>`: one of the library's glyphs, or a custom `template`. */
export function SmartIcon({ name, className, template }: SmartIconProps) {
  if (template) return <>{template}</>;

  switch (name) {
    case 'spinner':
      return <SmartIconSpinner className={className} />;
    case 'chevron-down':
      return <SmartIconChevronDown className={className} />;
    case 'chevron-up':
      return <SmartIconChevronUp className={className} />;
    default:
      return null;
  }
}
