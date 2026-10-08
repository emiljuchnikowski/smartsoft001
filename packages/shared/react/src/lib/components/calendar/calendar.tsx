import { useState } from 'react';

import { SmartCalendarProps } from './calendar.types';
import { SmartCalendarStandard } from './standard/calendar-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components.calendar` on
 * `SmartProvider`, `SmartCalendarStandard` by default. A missing
 * `referenceDate` is replaced with the date the wrapper was mounted, so
 * registered implementations always get one.
 */
export function SmartCalendar(props: SmartCalendarProps) {
  const Component = useSmartComponent('calendar', SmartCalendarStandard);
  const [today] = useState(() => new Date());

  return <Component {...props} referenceDate={props.referenceDate ?? today} />;
}
