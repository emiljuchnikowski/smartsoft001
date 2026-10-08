import { cn } from '../../../utils/class-names';
import { SmartLoaderProps } from '../loader.types';
import { getLoaderSpinnerClasses } from './preset-classes';

/**
 * Styled loader variation (preset). Register it as `components.loader` on
 * `SmartProvider` to restyle every `<SmartLoader>`, or render it directly.
 *
 * Renders the canonical Preline "default" spinner: a self-spinning bordered
 * ring (`border-current` arc with a transparent top border) sized via `size`
 * and coloured via `color`, across the shared `SmartColor` palette with
 * explicit `dark:` variants.
 */
export function SmartLoaderPreset({
  show = false,
  size = 'md',
  color = 'indigo',
  className = '',
}: SmartLoaderProps) {
  if (!show) return null;

  return (
    <div
      className={cn(getLoaderSpinnerClasses(size, color), className)}
      role="status"
      aria-label="loading"
    >
      <span className="smart:sr-only">Loading...</span>
    </div>
  );
}
