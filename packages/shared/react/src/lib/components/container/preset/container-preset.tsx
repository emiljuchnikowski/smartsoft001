import { cn } from '../../../utils/class-names';
import { SmartContainerProps } from '../container.types';
import { getContainerClasses } from './preset-classes';

/**
 * Styled container variation (preset). Register it as `components.container`
 * on `SmartProvider`, or render it directly. Unlike the neutral standard
 * component, it maps `IContainerOptions` (`mode`, `padding`, `narrow`) to
 * real layout utilities.
 */
export function SmartContainerPreset({
  options,
  className = '',
  children,
}: SmartContainerProps) {
  return (
    <div
      className={cn(
        getContainerClasses(options?.mode, options?.padding, options?.narrow),
        className,
      )}
      data-role="container"
    >
      {children}
    </div>
  );
}
