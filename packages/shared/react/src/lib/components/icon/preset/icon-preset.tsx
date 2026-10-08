import type { ReactNode } from 'react';

import { cn } from '../../../utils/class-names';
import { SmartIcon } from '../icon';
import { IconName } from '../icon.types';
import {
  getIconContainerClasses,
  getIconSizeClasses,
  IconPresetSize,
  IconPresetVariant,
} from './preset-classes';

export interface SmartIconPresetProps {
  name?: IconName;
  template?: ReactNode;
  variant?: IconPresetVariant;
  size?: IconPresetSize;
  className?: string;
}

/**
 * Styled icon variation (preset): `<SmartIcon>` inside a themed container,
 * across a `plain` / `contained` / `soft` variant scale in `sm` / `md` / `lg`.
 * There is no registry key for the icon, so the preset is used directly.
 */
export function SmartIconPreset({
  name = 'spinner',
  template,
  variant = 'plain',
  size = 'md',
  className,
}: SmartIconPresetProps) {
  return (
    <span
      className={cn(getIconContainerClasses(variant, size), className)}
      data-role="icon-preset"
    >
      <SmartIcon
        name={name}
        template={template}
        className={getIconSizeClasses(size)}
      />
    </span>
  );
}
