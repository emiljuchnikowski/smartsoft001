import {
  computed,
  Directive,
  effect,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';

import { DynamicComponentType } from '../../../models';

const BAR_FILLED_CLASSES: readonly string[] = [
  'smart:bg-red-600 dark:smart:bg-red-500',
  'smart:bg-orange-500 dark:smart:bg-orange-400',
  'smart:bg-yellow-500 dark:smart:bg-yellow-400',
];

const BAR_EMPTY_CLASS = 'smart:bg-gray-300 dark:smart:bg-gray-600';

const MSG_COLOR_CLASSES: readonly string[] = [
  'smart:text-red-600 dark:smart:text-red-400',
  'smart:text-orange-500 dark:smart:text-orange-400',
  'smart:text-yellow-600 dark:smart:text-yellow-500',
];

const CONTAINER_BASE = 'smart:w-1/3 max-sm:smart:w-full';

interface PasswordStrengthResult {
  lowerLetters: boolean;
  upperLetters: boolean;
  symbols: boolean;
  passLength: boolean;
}

@Directive()
export abstract class PasswordStrengthBaseComponent {
  static smartType: DynamicComponentType = 'password-strength';

  passwordToCheck: InputSignal<string> = input.required<string>();
  showHint: InputSignal<boolean> = input.required<boolean>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  passwordStrength: OutputEmitterRef<boolean> = output<boolean>();

  result: Signal<PasswordStrengthResult> = computed(() => {
    const p = this.passwordToCheck();
    const regex = /[$-/:-?{-~!"^_@`[\]]/g;
    const lowerLetters = !!p && /[a-z]+/.test(p);
    const upperLetters = /[A-Z]+/.test(p);
    const symbols = regex.test(p);
    const passLength = !(!p || (p?.length ?? 0) <= 6);
    return { lowerLetters, upperLetters, symbols, passLength };
  });

  strength: Signal<number> = computed(() => {
    const p = this.passwordToCheck();
    const { lowerLetters, upperLetters, symbols, passLength } = this.result();

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
  });

  strengthIndex: Signal<0 | 1 | 2 | 3> = computed(() => {
    const s = this.strength();
    if (s === 10) return 0;
    if (s === 20) return 1;
    if (s === 30) return 2;
    return 3;
  });

  msg: Signal<'' | 'poor' | 'notGood' | 'good'> = computed(() => {
    const s = this.strength();
    if (s === 10) return 'poor';
    if (s === 20) return 'notGood';
    if (s === 30) return 'good';
    return '';
  });

  barClasses: Signal<string[]> = computed(() => {
    const index = this.strengthIndex();
    const bars: string[] = [];
    for (let i = 0; i < 3; i++) {
      if (i < index + 1 && index < 3) {
        bars.push(BAR_FILLED_CLASSES[index]);
      } else {
        bars.push(BAR_EMPTY_CLASS);
      }
    }
    return bars;
  });

  msgClass: Signal<string> = computed(() => {
    const index = this.strengthIndex();
    if (index === 3) return '';
    return MSG_COLOR_CLASSES[index];
  });

  containerClasses: Signal<string> = computed(() => {
    const extra = this.cssClass();
    return extra ? `${CONTAINER_BASE} ${extra}` : CONTAINER_BASE;
  });

  constructor() {
    effect(() => {
      this.passwordStrength.emit(this.strength() === 30);
    });
  }
}
