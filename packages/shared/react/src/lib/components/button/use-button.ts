import { useCallback, useMemo, useState } from 'react';

import { SmartButtonProps } from './button.types';
import { COMPONENT_COLORS, SmartVariant } from '../../models';

/**
 * The behaviour every button variant shares (the Angular
 * `ButtonBaseComponent`): the colour classes of the variant, and the confirm
 * mode, where a first click asks for confirmation instead of running
 * `options.click`.
 */
export function useButton({ options, disabled = false }: SmartButtonProps) {
  const [mode, setMode] = useState<'default' | 'confirm'>('default');

  const variantClasses = useMemo(() => {
    const variant: SmartVariant = options?.variant ?? 'primary';
    const color = options?.color ?? 'indigo';
    const classes: string[] = ['smart:font-semibold', 'smart:shadow-xs'];
    const colorEntry = COMPONENT_COLORS[color] ?? COMPONENT_COLORS['indigo'];

    classes.push(...colorEntry[variant]);

    if (disabled) {
      classes.push('smart:opacity-50', 'smart:cursor-not-allowed');
    }

    return classes;
  }, [options?.variant, options?.color, disabled]);

  const invoke = useCallback(() => {
    if (!options) return;

    if (options.confirm) {
      setMode('confirm');
    } else {
      options.click();
    }
  }, [options]);

  const confirmInvoke = useCallback(() => {
    if (!options) return;

    options.click();
    setMode('default');
  }, [options]);

  const confirmCancel = useCallback(() => {
    if (!options) return;

    setMode('default');
  }, [options]);

  return {
    mode,
    loading: !!options?.loading,
    variantClasses,
    invoke,
    confirmInvoke,
    confirmCancel,
  };
}
