import { cn } from '../../../utils/class-names';
import { SmartDrawerProps } from '../drawer.types';
import { useDrawer } from '../use-drawer';
import {
  getDrawerBackdropClasses,
  getDrawerBodyClasses,
  getDrawerCloseClasses,
  getDrawerHeaderClasses,
  getDrawerPanelClasses,
  getDrawerTitleClasses,
} from './preset-classes';

/**
 * Styled drawer (offcanvas) variation (preset). Register it as
 * `components.drawer` on `SmartProvider` to restyle every `<SmartDrawer>`, or
 * render it directly.
 *
 * A sliding side panel with a header (title + close button), a body slot and
 * an optional backdrop. Open/close, side placement (`options.position`), width
 * (`options.wide`), the backdrop (`options.withOverlay`) and the branded header
 * (`options.brandedHeader`) are driven by props; no Preline JS runtime is used.
 */
export function SmartDrawerPreset(props: SmartDrawerProps) {
  const { title, options, className, children } = props;
  const { open, close } = useDrawer(props);

  if (!open) return null;

  const position = options?.position ?? 'right';
  const brandedHeader = Boolean(options?.brandedHeader);

  return (
    <>
      {options?.withOverlay && (
        <div
          className={getDrawerBackdropClasses()}
          aria-hidden="true"
          onClick={close}
        />
      )}
      <aside
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn(
          getDrawerPanelClasses(position, Boolean(options?.wide)),
          className,
        )}
        data-position={position}
        aria-labelledby={title ? 'smart-drawer-preset-title' : undefined}
      >
        <div className={getDrawerHeaderClasses(brandedHeader)}>
          <h3
            id="smart-drawer-preset-title"
            className={getDrawerTitleClasses(brandedHeader)}
          >
            {title}
          </h3>
          <button
            type="button"
            aria-label="Close"
            className={getDrawerCloseClasses(brandedHeader)}
            onClick={close}
          >
            <span className="smart:sr-only">Close</span>
            <svg
              className="smart:shrink-0 smart:size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className={getDrawerBodyClasses()}>{children}</div>
      </aside>
    </>
  );
}
