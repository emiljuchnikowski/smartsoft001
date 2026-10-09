import { useCallback, useEffect, useState } from 'react';

import { useSmart } from '../../../providers/smart-context';
import { useInput } from '../base/use-input';
import { useInputFile } from '../base/use-input-file';
import { SmartInputFieldProps } from '../input.types';

/** How long after a change the new video gets its URL, in milliseconds. */
const VIDEO_URL_DELAY = 5000;

/**
 * {@link useInput} and {@link useInputFile} plus the player of the video
 * fields: every change of the value stops the player (`play` false, no `url`),
 * and five seconds later the URL of the new attachment is set. The initial
 * value gets no URL. `onPlay` (the `playButtonOptions.click`) shows the player.
 */
export function useInputVideo<T>(props: SmartInputFieldProps<T>) {
  const input = useInput(props);
  const file = useInputFile(props);
  const { fileService } = useSmart();
  const { control } = input;
  const [url, setUrl] = useState<string | null>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (!control) return undefined;

    const timers = new Set<ReturnType<typeof setTimeout>>();
    const subscription = control.valueChanges.subscribe((value) => {
      setUrl(null);
      setPlay(false);

      const timer = setTimeout(() => {
        timers.delete(timer);

        if (!value?.id) return;

        setUrl(fileService?.getUrl(value.id) ?? null);
      }, VIDEO_URL_DELAY);

      timers.add(timer);
    });

    return () => {
      subscription.unsubscribe();
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [control, fileService]);

  const onPlay = useCallback(() => setPlay(true), []);

  return { ...input, ...file, url, play, onPlay };
}
