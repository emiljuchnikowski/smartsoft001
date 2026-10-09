import { SmartContainerProps } from '../container.types';

/**
 * The default container rendering: a neutral `div` exposing `options.mode` /
 * `options.padding` as `data-mode` / `data-padding` for the application's own
 * styling.
 */
export function SmartContainerStandard({
  options,
  className,
  children,
}: SmartContainerProps) {
  return (
    <div
      className={className || undefined}
      data-mode={options?.mode}
      data-padding={options?.padding}
    >
      {children}
    </div>
  );
}
