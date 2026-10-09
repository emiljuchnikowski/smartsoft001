import { SmartCommandPaletteProps } from './command-palette.types';
import { SmartCommandPaletteStandard } from './standard/command-palette-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components['command-palette']` on
 * `SmartProvider`, `SmartCommandPaletteStandard` by default. Every prop,
 * including `onOpenChange`, `onQueryChange` and `onRunCommand`, is passed
 * through to the implementation.
 */
export function SmartCommandPalette(props: SmartCommandPaletteProps) {
  const Component = useSmartComponent(
    'command-palette',
    SmartCommandPaletteStandard,
  );

  return <Component {...props} />;
}
