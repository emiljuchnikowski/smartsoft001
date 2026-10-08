import { SmartListContainerProps } from '../list-container.types';

/**
 * The default list-container rendering (`<smart-list-container-standard>`): a
 * `role="list"` element around `children`, exposing `options.variant` as
 * `data-variant` for styling.
 */
export function SmartListContainerStandard({
  options,
  className,
  children,
}: SmartListContainerProps) {
  return (
    <div
      role="list"
      className={className}
      data-variant={options?.variant ?? undefined}
    >
      {children}
    </div>
  );
}
