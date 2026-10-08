import { IStyle, StyleType } from '../../models/style';

const COLORS = [
  'primary',
  'secondary',
  'tertiary',
  'success',
  'warning',
  'danger',
  'dark',
  'medium',
  'light',
];

const COLOR_SUFFIXES = [
  '',
  '-rgb',
  '-contrast',
  '-contrast-rgb',
  '-shade',
  '-tint',
];

/**
 * Writes the application's style settings (colours, font, button metrics,
 * breakpoints) as CSS custom properties on an element, the way the Angular
 * `StyleService` did. Settings accumulate across calls to `set`.
 */
export class StyleService {
  private style: IStyle = {};
  private element: HTMLElement | null = null;

  init(element: HTMLElement | null, style?: IStyle): void {
    this.element = element;
    this.set(style);
  }

  set(style?: IStyle): void {
    this.style = { ...this.style, ...(style ?? {}) };
    this.execute();
  }

  get(): IStyle {
    return this.style;
  }

  private execute(): void {
    for (const name of COLORS) {
      for (const suffix of COLOR_SUFFIXES) {
        const type = `color-${name}${suffix}` as StyleType;

        this.setProperty(`--smart-color-${name}${suffix}`, type);
        this.setProperty(`--ion-color-${name}${suffix}`, type);
      }
    }

    this.setProperty('--ion-font-family', 'font');
    this.setProperty('--default-font-weight', 'font-weight');
    this.setProperty('--default-font-style', 'font-style');

    this.setProperty('--smart-button-height', 'button-height');
    this.setProperty('--smart-button-min-width', 'button-min-width');
    this.setProperty('--smart-button-padding-right', 'button-padding-right');
    this.setProperty('--smart-button-padding-left', 'button-padding-left');
    this.setProperty('--smart-button-padding-top', 'button-padding-top');
    this.setProperty('--smart-button-padding-bottom', 'button-padding-bottom');
    this.setProperty('--smart-button-icon-size', 'button-icon-size');

    this.setProperty('--phone-breakpoint', 'phone-breakpoint');
    this.setProperty('--tablet-breakpoint', 'tablet-breakpoint');
  }

  private setProperty(property: string, type: StyleType): void {
    const value = this.style[type];

    if (!this.element || !value) return;

    this.element.style.setProperty(property, value);
  }
}
