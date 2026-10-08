import { useCallback, useEffect, useRef, useState } from 'react';

import { SmartAccordionStateProps } from './accordion.types';

const SHARED_CONTAINER_CLASSES = [
  'smart:divide-y',
  'smart:divide-gray-200',
  'smart:rounded-lg',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:divide-white/10',
  'smart:dark:border-white/10',
];

/**
 * The behaviour every accordion variant shares: the open state, controlled
 * through `show` + `onShowChange` or kept internally, and `toggle()`, which
 * does nothing while `options.disabled`.
 *
 * `options.open` is applied once, on the first render: an uncontrolled
 * accordion starts open, and `onShowChange(true)` is reported unless `show` /
 * `defaultShow` was already `true`. A controlled accordion stays as its `show`
 * prop says until the parent applies that change. Later changes of
 * `options.open` are ignored.
 */
export function useAccordion({
  show: showProp,
  defaultShow = false,
  onShowChange,
  options,
}: SmartAccordionStateProps) {
  const controlled = showProp !== undefined;
  const [internalShow, setInternalShow] = useState(
    () => defaultShow || !!options?.open,
  );
  const show = controlled ? showProp : internalShow;
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    const initialShow = controlled ? showProp : defaultShow;
    if (options?.open && !initialShow) onShowChange?.(true);
    // Runs once, on mount: later prop changes must not reopen it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = useCallback(() => {
    if (options?.disabled) return;

    const next = !show;
    if (!controlled) setInternalShow(next);
    onShowChange?.(next);
  }, [options?.disabled, show, controlled, onShowChange]);

  return {
    show,
    toggle,
    sharedContainerClasses: SHARED_CONTAINER_CLASSES,
  };
}
