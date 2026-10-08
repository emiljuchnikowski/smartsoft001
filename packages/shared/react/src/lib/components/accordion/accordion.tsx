import { SmartAccordionProps } from './accordion.types';
import { SmartAccordionDefault } from './default/accordion-default';

/**
 * `<smart-accordion>`: `SmartAccordionDefault` fed with the
 * `accordionHeader` / `accordionBody` slots. The Angular accordion has no
 * component token, so there is no registry key: render `SmartAccordionPreset`
 * directly for the styled variation.
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
