import { SmartSectionHeadingProps } from './section-heading.types';
import { SmartSectionHeadingStandard } from './standard/section-heading-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components['section-heading']` on
 * `SmartProvider`, `SmartSectionHeadingStandard` by default.
 */
export function SmartSectionHeading(props: SmartSectionHeadingProps) {
  const Component = useSmartComponent(
    'section-heading',
    SmartSectionHeadingStandard,
  );

  return <Component {...props} />;
}
