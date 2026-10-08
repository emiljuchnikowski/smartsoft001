import { cn } from '../../../utils/class-names';
import { SmartAccordionBaseProps } from '../accordion.types';
import { SmartAccordionBody } from '../body/accordion-body';
import { SmartAccordionHeader } from '../header/accordion-header';
import { useAccordion } from '../use-accordion';

/**
 * The default accordion rendering (`<smart-accordion-default>`): a bordered
 * card whose header toggles the body. See `SmartAccordionStateProps` for the
 * controlled / uncontrolled `show`.
 */
export function SmartAccordionDefault(props: SmartAccordionBaseProps) {
  const { options, className, headerTpl, bodyTpl } = props;
  const { show, toggle, sharedContainerClasses } = useAccordion(props);

  return (
    <div className={cn(sharedContainerClasses, className)}>
      <div onClick={toggle}>
        <SmartAccordionHeader open={show} disabled={options?.disabled ?? false}>
          {headerTpl}
        </SmartAccordionHeader>
      </div>

      {show && <SmartAccordionBody>{bodyTpl}</SmartAccordionBody>}
    </div>
  );
}
