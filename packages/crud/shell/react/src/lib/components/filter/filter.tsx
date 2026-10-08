import { FieldType } from '@smartsoft001/models';

import { SmartCrudFilterCheck } from './check/filter-check';
import { SmartCrudFilterDate } from './date/filter-date';
import { SmartCrudFilterDateTime } from './date-time/filter-date-time';
import { SmartCrudFilterDateWithEdit } from './date-with-edit/filter-date-with-edit';
import { SmartCrudFilterProps } from './filter.types';
import { SmartCrudFilterFlag } from './flag/filter-flag';
import { SmartCrudFilterInt } from './int/filter-int';
import { SmartCrudFilterRadio } from './radio/filter-radio';
import { SmartCrudFilterText } from './text/filter-text';

function SmartCrudFilterField(props: SmartCrudFilterProps) {
  switch (props.item?.fieldType) {
    case FieldType.date:
      return <SmartCrudFilterDate {...props} />;
    case FieldType.dateWithEdit:
      return <SmartCrudFilterDateWithEdit {...props} />;
    case FieldType.dateTime:
      return <SmartCrudFilterDateTime {...props} />;
    case FieldType.radio:
      return <SmartCrudFilterRadio {...props} />;
    case FieldType.check:
      return <SmartCrudFilterCheck {...props} />;
    case FieldType.flag:
      return <SmartCrudFilterFlag {...props} />;
    case FieldType.int:
      return <SmartCrudFilterInt {...props} />;
    default:
      return <SmartCrudFilterText {...props} />;
  }
}

/**
 * `<smart-crud-filter>` (Angular `FilterComponent`): the filter field of the
 * item's field type (date, date with edit, date-time, radio, check, flag,
 * int; text otherwise), reading and writing the list filter through the
 * feature's facade.
 */
export function SmartCrudFilter(props: SmartCrudFilterProps) {
  return (
    <div className="smart:py-1">
      <SmartCrudFilterField {...props} />
    </div>
  );
}
