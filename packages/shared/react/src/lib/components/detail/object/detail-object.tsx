import { useDetailObject } from './use-detail-object';
import { cn } from '../../../utils/class-names';
import { SmartDetails } from '../../details/details';
import { SmartDetailFieldProps } from '../detail.types';

/**
 * The object detail: the nested object's own details, rendered through
 * `<SmartDetails>`, so `components.details` applies to it too.
 */
export function SmartDetailObject<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { childOptions } = useDetailObject(props);

  if (!childOptions) return null;

  return (
    <div className={cn(['smart:mt-2', 'smart:block'], className)}>
      <SmartDetails options={childOptions} />
    </div>
  );
}
