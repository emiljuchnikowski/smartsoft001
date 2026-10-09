import { IModelFilter } from '@smartsoft001/models';

import { ICrudFilter } from '../../models';

/** The props of `SmartCrudFilter` and of every filter field. */
export interface SmartCrudFilterProps {
  /** The filter definition of the model (`IModelOptions.filters` item). */
  item?: IModelFilter;
  /** The current filter of the list, e.g. `useCrudState(s => s.filter)`. */
  filter?: ICrudFilter | null;
}

/** An option of a radio / check filter. */
export interface CrudFilterPossibility {
  id: any;
  text: string;
}
