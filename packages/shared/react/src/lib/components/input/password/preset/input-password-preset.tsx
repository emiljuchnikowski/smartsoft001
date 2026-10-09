import { useEffect, useId, useState } from 'react';

import { cn } from '../../../../utils/class-names';
import { SmartInputFieldProps } from '../../input.types';
import { useInputPassword } from '../use-input-password';

const PATTERNS = [
  {
    key: 'min-length',
    label: 'Minimum number of characters is 6.',
    test: (v: string) => v.length >= 6,
  },
  {
    key: 'lowercase',
    label: 'Should contain lowercase.',
    test: (v: string) => /[a-z]/.test(v),
  },
  {
    key: 'uppercase',
    label: 'Should contain uppercase.',
    test: (v: string) => /[A-Z]/.test(v),
  },
  {
    key: 'numbers',
    label: 'Should contain numbers.',
    test: (v: string) => /[0-9]/.test(v),
  },
  {
    key: 'special-characters',
    label: 'Should contain special characters.',
    test: (v: string) => /[^a-zA-Z0-9]/.test(v),
  },
];

const BARS = [0, 1, 2, 3, 4];

const LEVELS = [
  'Empty',
  'Weak',
  'Medium',
  'Strong',
  'Very Strong',
  'Super Strong',
];

const LABEL_CLASSES = [
  'smart:block',
  'smart:text-sm',
  'smart:font-medium',
  'smart:mb-2',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

const INPUT_CLASSES = [
  'smart:py-2.5',
  'smart:sm:py-3',
  'smart:px-4',
  'smart:block',
  'smart:w-full',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:rounded-md',
  'smart:sm:text-sm',
  'smart:text-gray-900',
  'smart:dark:text-white',
  'smart:placeholder:text-gray-500',
  'smart:dark:placeholder:text-gray-400',
  'smart:focus:border-blue-600',
  'smart:dark:focus:border-blue-500',
  'smart:focus:ring-1',
  'smart:focus:ring-blue-600',
  'smart:dark:focus:ring-blue-500',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
].join(' ');

function getBarClasses(
  index: number,
  passedCount: number,
  accepted: boolean,
): string {
  const base = [
    'smart:h-2',
    'smart:flex-auto',
    'smart:rounded-full',
    'smart:mx-1',
  ];

  if (index >= passedCount) {
    return [
      ...base,
      'smart:bg-gray-200',
      'smart:dark:bg-gray-700',
      'smart:opacity-50',
    ].join(' ');
  }

  if (accepted) {
    return [...base, 'smart:bg-teal-500', 'smart:opacity-100'].join(' ');
  }

  return [
    ...base,
    'smart:bg-blue-600',
    'smart:dark:bg-blue-500',
    'smart:opacity-100',
  ].join(' ');
}

function getRuleClasses(passed: boolean): string {
  const base = ['smart:flex', 'smart:items-center', 'smart:gap-x-2'];

  if (passed) {
    return [...base, 'smart:text-teal-500'].join(' ');
  }

  return base.join(' ');
}

/**
 * Styled `password` field (preset): the Preline "Strong Password" look. With
 * `fieldOptions.possibilities.strength` it renders a five-bar meter under the
 * input and, while the input has focus, the level and the rules the password
 * meets (at least 6 characters, a lowercase letter, an uppercase letter, a
 * number, a special character). Until all five pass the control has the
 * `passwordStrength` error (see {@link useInputPassword}).
 *
 * The texts are English literals. The rating follows the control's value, so it
 * also follows a value set from code. A `<key>Confirm` control renders through
 * it the same way as through {@link SmartInputPassword}. Register it as
 * `inputFieldComponents[FieldType.password]` on `SmartProvider`.
 */
export function SmartInputPasswordPreset<T>(props: SmartInputFieldProps<T>) {
  const { className, fieldOptions } = props;
  const {
    control,
    value,
    required,
    disabled,
    label,
    setValue,
    markAsTouched,
    autoFocus,
    onChangePasswordStrength,
  } = useInputPassword(props);
  const id = useId();
  const [focus, setFocus] = useState(false);

  const strength = !!fieldOptions?.possibilities?.strength;
  const password: string = value ?? '';
  const rules = PATTERNS.map((p) => ({
    key: p.key,
    label: p.label,
    passed: p.test(password),
  }));
  const passedCount = rules.filter((r) => r.passed).length;
  const accepted = passedCount === PATTERNS.length;

  useEffect(() => {
    if (!control) return;
    if (!strength) return;

    onChangePasswordStrength(accepted);
  }, [control, strength, accepted, onChangePasswordStrength]);

  if (!control) return null;

  return (
    <>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>

      <input
        id={id}
        type="password"
        className={cn(INPUT_CLASSES, className)}
        value={value ?? ''}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => {
          setFocus(false);
          markAsTouched();
        }}
      />

      {strength && (
        <div className="smart:mt-2" data-role="strength-meter">
          <div className="smart:flex smart:-mx-1">
            {BARS.map((bar, index) => (
              <div
                key={bar}
                className={getBarClasses(index, passedCount, accepted)}
                data-role="strength-bar"
              ></div>
            ))}
          </div>

          {focus && (
            <div className="smart:mt-3" data-role="strength-hints">
              <div>
                <span className="smart:text-sm smart:text-gray-900 smart:dark:text-white">
                  Level:
                </span>
                <span
                  className="smart:text-sm smart:font-semibold smart:text-gray-900 smart:dark:text-white"
                  data-role="strength-level"
                >
                  {LEVELS[passedCount]}
                </span>
              </div>

              <h4 className="smart:my-2 smart:text-sm smart:font-semibold smart:text-gray-900 smart:dark:text-white">
                Your password must contain:
              </h4>

              <ul className="smart:space-y-1 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400">
                {rules.map((rule) => (
                  <li
                    key={rule.key}
                    className={getRuleClasses(rule.passed)}
                    data-role="strength-rule"
                  >
                    {rule.passed ? (
                      <span data-check="">
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
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    ) : (
                      <span data-uncheck="">
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
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </span>
                    )}
                    {rule.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
}
