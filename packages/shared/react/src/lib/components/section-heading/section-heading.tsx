import { SmartSectionHeadingProps } from './section-heading.types';
import { SmartSectionHeadingStandard } from './standard/section-heading-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-section-heading>`: renders the implementation registered as
 * `components['section-heading']` on `SmartProvider` (the Angular
 * `SECTION_HEADING_STANDARD_COMPONENT_TOKEN`), `SmartSectionHeadingStandard`
 * by default.
 */
export function SmartSectionHeading(props: SmartSectionHeadingProps) {
  const Component = useSmartComponent(
    'section-heading',
    SmartSectionHeadingStandard,
  );

  return <Component {...props} />;
}
