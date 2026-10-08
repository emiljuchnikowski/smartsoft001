import { SmartAccordionProps } from './accordion.types';
import { SmartAccordionDefault } from './default/accordion-default';

/**
 * `SmartAccordionDefault` fed with the `accordionHeader` / `accordionBody`
 * slots. There is no registry key: render `SmartAccordionPreset` directly for
 * the styled variation.
 */
export function SmartAccordion({
  accordionHeader,
  accordionBody,
  ...props
}: SmartAccordionProps) {
  return (
    <SmartAccordionDefault
      {...props}
      headerTpl={accordionHeader}
      bodyTpl={accordionBody}
    />
  );
}
