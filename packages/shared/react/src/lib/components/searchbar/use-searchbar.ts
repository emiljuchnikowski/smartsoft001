import { useCallback, useEffect, useRef, useState } from 'react';

import { SmartSearchbarProps } from './searchbar.types';
import { SmartFormControl } from '../../forms/form-control';

/**
 * The behaviour every searchbar variant shares.
 *
 * The field is bound to `control`. Its changes reach `text` once they settle
 * for `options.debounceTime` ms (1000 by default); a non-empty `text` coming
 * from outside is copied into the control without being reported back.
 * `tryHide()` (on blur) hides an empty searchbar, `setShow()` shows it again.
 * `show` and `text` are controlled through `show` / `onShowChange` and
 * `text` / `onTextChange`, or kept internally from `defaultShow` /
 * `defaultText`.
 */
export function useSearchbar({
  options,
  show: showProp,
  defaultShow = true,
  onShowChange,
  text: textProp,
  defaultText = '',
  onTextChange,
}: SmartSearchbarProps) {
  const [control] = useState(() => new SmartFormControl<string | null>(null));

  const [innerShow, setInnerShow] = useState(defaultShow);
  const showControlled = showProp !== undefined;
  const show = showControlled ? showProp : innerShow;

  const [innerText, setInnerText] = useState(defaultText);
  const textControlled = textProp !== undefined;
  const text = textControlled ? textProp : innerText;

  const changeShow = useCallback(
    (next: boolean) => {
      if (!showControlled) setInnerShow(next);
      onShowChange?.(next);
    },
    [showControlled, onShowChange],
  );

  // The debounced subscription outlives renders; it reads the latest setter.
  const changeTextRef = useRef<(next: string) => void>(() => undefined);
  changeTextRef.current = (next: string) => {
    if (!textControlled) setInnerText(next);
    onTextChange?.(next);
  };

  useEffect(() => {
    if (text?.length) control.setValue(text, { emitEvent: false });
  }, [control, text]);

  const debounceMs = options?.debounceTime ?? 1000;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const subscription = control.valueChanges.subscribe((value) => {
      clearTimeout(timer);
      timer = setTimeout(() => changeTextRef.current(value ?? ''), debounceMs);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [control, debounceMs]);

  const setShow = useCallback(() => changeShow(true), [changeShow]);

  const tryHide = useCallback(() => {
    if (!control.value) changeShow(false);
  }, [control, changeShow]);

  return { show, text, control, setShow, tryHide };
}
