import { useRef } from 'react';
import type { KeyboardEvent, Ref } from 'react';

import { cn } from '../../../utils/class-names';
import { SmartDateEditVariantProps } from '../date-edit.types';
import { useDateEdit } from '../use-date-edit';

/** The number in a digit input: an emptied input is `null`. */
function toNumber(value: string): number | null {
  return value === '' ? null : parseFloat(value);
}

interface DigitInputProps {
  digit: string | null;
  validDate: boolean;
  inputRef: Ref<HTMLInputElement>;
  onDigitChange: (value: number | null) => void;
  onClick: () => void;
  onKeyUp: (event: KeyboardEvent<HTMLInputElement>) => void;
}

function DigitInput({
  digit,
  validDate,
  inputRef,
  onDigitChange,
  onClick,
  onKeyUp,
}: DigitInputProps) {
  return (
    <input
      ref={inputRef}
      type="number"
      min="0"
      max="9"
      maxLength={1}
      value={digit ?? ''}
      onChange={(event) => onDigitChange(toNumber(event.target.value))}
      onClick={onClick}
      onKeyUp={onKeyUp}
      className={cn(
        'smart:w-8 smart:h-10 smart:text-center smart:border smart:border-gray-300 smart:rounded-md smart:text-sm smart:font-medium smart:text-gray-900 smart:focus:ring-2 smart:focus:ring-indigo-500 smart:focus:border-indigo-500 smart:dark:bg-gray-800 smart:dark:border-gray-600 smart:dark:text-white',
        !validDate && 'smart:border-red-500',
        !validDate && 'smart:text-red-600',
      )}
    />
  );
}

function DigitLabel({
  validDate,
  children,
}: {
  validDate: boolean;
  children: string;
}) {
  return (
    <span
      className={cn(
        'smart:text-xs smart:text-gray-400 smart:dark:text-gray-500',
        !validDate && 'smart:text-red-500',
      )}
    >
      {children}
    </span>
  );
}

/**
 * The default date-edit rendering: eight single-digit inputs spelling
 * DD-MM-RRRR. A digit moves the focus to the next input.
 */
export function SmartDateEditStandard(props: SmartDateEditVariantProps) {
  const { className } = props;
  const {
    validDate,
    setValueAt,
    moveTo,
    select,
    d1,
    d2,
    m1,
    m2,
    y1,
    y2,
    y3,
    y4,
  } = useDateEdit(props);

  const d1Element = useRef<HTMLInputElement>(null);
  const d2Element = useRef<HTMLInputElement>(null);
  const m1Element = useRef<HTMLInputElement>(null);
  const m2Element = useRef<HTMLInputElement>(null);
  const y1Element = useRef<HTMLInputElement>(null);
  const y2Element = useRef<HTMLInputElement>(null);
  const y3Element = useRef<HTMLInputElement>(null);
  const y4Element = useRef<HTMLInputElement>(null);

  return (
    <div
      className={cn(
        'smart:inline-flex smart:items-start smart:gap-3',
        className,
      )}
    >
      <div className="smart:flex smart:flex-col smart:items-center smart:gap-0.5">
        <div className="smart:flex smart:items-center smart:gap-0.5">
          <DigitInput
            digit={d1}
            validDate={validDate}
            inputRef={d1Element}
            onDigitChange={(val) => setValueAt(val, 8)}
            onClick={() => select(d1Element.current)}
            onKeyUp={(event) => moveTo(event, d2Element.current)}
          />
          <DigitInput
            digit={d2}
            validDate={validDate}
            inputRef={d2Element}
            onDigitChange={(val) => setValueAt(val, 9)}
            onClick={() => select(d2Element.current)}
            onKeyUp={(event) => moveTo(event, m1Element.current)}
          />
        </div>
        <DigitLabel validDate={validDate}>DD</DigitLabel>
      </div>

      <span className="smart:text-gray-400 smart:mt-2.5 smart:text-sm smart:font-medium">
        -
      </span>

      <div className="smart:flex smart:flex-col smart:items-center smart:gap-0.5">
        <div className="smart:flex smart:items-center smart:gap-0.5">
          <DigitInput
            digit={m1}
            validDate={validDate}
            inputRef={m1Element}
            onDigitChange={(val) => setValueAt(val, 5)}
            onClick={() => select(m1Element.current)}
            onKeyUp={(event) => moveTo(event, m2Element.current)}
          />
          <DigitInput
            digit={m2}
            validDate={validDate}
            inputRef={m2Element}
            onDigitChange={(val) => setValueAt(val, 6)}
            onClick={() => select(m2Element.current)}
            onKeyUp={(event) => moveTo(event, y1Element.current)}
          />
        </div>
        <DigitLabel validDate={validDate}>MM</DigitLabel>
      </div>

      <span className="smart:text-gray-400 smart:mt-2.5 smart:text-sm smart:font-medium">
        -
      </span>

      <div className="smart:flex smart:flex-col smart:items-center smart:gap-0.5">
        <div className="smart:flex smart:items-center smart:gap-0.5">
          <DigitInput
            digit={y1}
            validDate={validDate}
            inputRef={y1Element}
            onDigitChange={(val) => setValueAt(val, 0)}
            onClick={() => select(y1Element.current)}
            onKeyUp={(event) => moveTo(event, y2Element.current)}
          />
          <DigitInput
            digit={y2}
            validDate={validDate}
            inputRef={y2Element}
            onDigitChange={(val) => setValueAt(val, 1)}
            onClick={() => select(y2Element.current)}
            onKeyUp={(event) => moveTo(event, y3Element.current)}
          />
          <DigitInput
            digit={y3}
            validDate={validDate}
            inputRef={y3Element}
            onDigitChange={(val) => setValueAt(val, 2)}
            onClick={() => select(y3Element.current)}
            onKeyUp={(event) => moveTo(event, y4Element.current)}
          />
          <DigitInput
            digit={y4}
            validDate={validDate}
            inputRef={y4Element}
            onDigitChange={(val) => setValueAt(val, 3)}
            onClick={() => select(y4Element.current)}
            onKeyUp={() => select(y4Element.current)}
          />
        </div>
        <DigitLabel validDate={validDate}>RRRR</DigitLabel>
      </div>
    </div>
  );
}
