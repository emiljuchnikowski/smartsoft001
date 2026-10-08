import { useEffect, useMemo, useRef } from 'react';

import { SmartPasswordStrengthProps } from './password-strength.types';

const BAR_FILLED_CLASSES: readonly string[] = [
  'smart:bg-red-600 smart:dark:bg-red-500',
  'smart:bg-orange-500 smart:dark:bg-orange-400',
  'smart:bg-yellow-500 smart:dark:bg-yellow-400',
];

const BAR_EMPTY_CLASS = 'smart:bg-gray-300 smart:dark:bg-gray-600';

const MSG_COLOR_CLASSES: readonly string[] = [
  'smart:text-red-600 smart:dark:text-red-400',
  'smart:text-orange-500 smart:dark:text-orange-400',
  'smart:text-yellow-600 smart:dark:text-yellow-500',
];

export type PasswordStrengthMessage = '' | 'poor' | 'notGood' | 'good';

const CONTAINER_BASE = 'smart:w-1/3 smart:max-sm:w-full';

export interface PasswordStrengthResult {
  lowerLetters: boolean;
  upperLetters: boolean;
  symbols: boolean;
  passLength: boolean;
}

function checkPassword(p: string): PasswordStrengthResult {
  const regex = /[$-/:-?{-~!"^_@`[\]]/g;
  const lowerLetters = !!p && /[a-z]+/.test(p);
  const upperLetters = /[A-Z]+/.test(p);
  const symbols = regex.test(p);
  const passLength = !(!p || (p?.length ?? 0) <= 6);

  return { lowerLetters, upperLetters, symbols, passLength };
}

function getStrength(p: string, result: PasswordStrengthResult): number {
  const { lowerLetters, upperLetters, symbols, passLength } = result;

  const flags = [lowerLetters, upperLetters, symbols];
  let passedMatches = 0;
  for (const flag of flags) passedMatches += flag ? 1 : 0;

  let force = 0;
  force += 2 * (p?.length ?? 0) + ((p?.length ?? 0) >= 8 ? 1 : 0);
  force += passedMatches * 10;

  force = !passLength ? Math.min(force, 10) : force;
  force = passedMatches === 1 ? Math.min(force, 10) : force;
  force = passedMatches === 2 ? Math.min(force, 20) : force;
  force = passedMatches === 3 ? Math.min(force, 30) : force;

  return force;
}

function getStrengthIndex(strength: number): 0 | 1 | 2 | 3 {
  if (strength === 10) return 0;
  if (strength === 20) return 1;
  if (strength === 30) return 2;
  return 3;
}

function getMessage(strength: number): PasswordStrengthMessage {
  if (strength === 10) return 'poor';
  if (strength === 20) return 'notGood';
  if (strength === 30) return 'good';
  return '';
}

/**
 * The rating every password strength variant shares.
 */
export function usePasswordStrength({
  passwordToCheck,
  className = '',
  onPasswordStrength,
}: SmartPasswordStrengthProps) {
  const result = useMemo(
    () => checkPassword(passwordToCheck),
    [passwordToCheck],
  );
  const strength = getStrength(passwordToCheck, result);
  const strengthIndex = getStrengthIndex(strength);

  // Emits whenever the strength changes; the ref keeps a new callback identity
  // from re-emitting.
  const onPasswordStrengthRef = useRef(onPasswordStrength);
  onPasswordStrengthRef.current = onPasswordStrength;

  useEffect(() => {
    onPasswordStrengthRef.current?.(strength === 30);
  }, [strength]);

  const barClasses = useMemo(() => {
    const bars: string[] = [];
    for (let i = 0; i < 3; i++) {
      if (i < strengthIndex + 1 && strengthIndex < 3) {
        bars.push(BAR_FILLED_CLASSES[strengthIndex]);
      } else {
        bars.push(BAR_EMPTY_CLASS);
      }
    }
    return bars;
  }, [strengthIndex]);

  const msg = getMessage(strength);
  const msgClass = strengthIndex === 3 ? '' : MSG_COLOR_CLASSES[strengthIndex];
  const containerClasses = className
    ? `${CONTAINER_BASE} ${className}`
    : CONTAINER_BASE;

  return {
    result,
    strength,
    strengthIndex,
    msg,
    barClasses,
    msgClass,
    containerClasses,
  };
}
