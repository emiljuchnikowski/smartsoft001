import { cn } from '../../../../utils/class-names';
import { SmartDetailFieldProps } from '../../detail.types';
import { useDetail } from '../../use-detail';

/** Styled logo detail (preset, `DetailLogoPresetComponent`): a compact logo. */
export function SmartDetailLogoPreset<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { item, key, value } = useDetail(props);

  if (!item || !key || !value) return null;

  return (
    <img
      data-role="logo"
      className={cn(['smart:max-h-10', 'smart:object-contain'], className)}
      src={value}
      alt=""
    />
  );
}
