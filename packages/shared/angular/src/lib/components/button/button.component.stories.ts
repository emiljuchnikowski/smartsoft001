import { importProvidersFrom, signal, WritableSignal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { ButtonCircularComponent } from './circular/circular.component';
import { ButtonRoundedComponent } from './rounded/rounded.component';
import { ButtonStandardComponent } from './standard/standard.component';
import {
  SmartColor,
  SmartSize,
  SmartVariant,
  IButtonOptions,
} from '../../models';

const clickAction = () => console.log('Button clicked');

const iconPlus = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>`;
const iconCheck = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="smart:size-5 smart:-ml-0.5"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" /></svg>`;
const iconCheckTrailing = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="smart:size-5 smart:-mr-0.5"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" /></svg>`;

const meta: Meta = {
  title: 'Components/Button',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(TranslateModule.forRoot())],
    }),
    moduleMetadata({
      imports: [
        ButtonStandardComponent,
        ButtonRoundedComponent,
        ButtonCircularComponent,
      ],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'soft'] as SmartVariant[],
      description: 'Color variant',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'] as SmartSize[],
      description: 'Size',
    },
    shape: {
      control: 'radio',
      options: ['standard', 'rounded', 'circular'],
      description: 'Shape of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    confirm: {
      control: 'boolean',
      description: 'Show confirm/cancel on click',
    },
    color: {
      control: 'select',
      options: [
        'slate',
        'gray',
        'zinc',
        'neutral',
        'stone',
        'red',
        'orange',
        'amber',
        'yellow',
        'lime',
        'green',
        'emerald',
        'teal',
        'cyan',
        'sky',
        'blue',
        'indigo',
        'violet',
        'purple',
        'fuchsia',
        'pink',
        'rose',
      ] as SmartColor[],
      description: 'Tailwind color color',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
    },
    label: {
      control: 'text',
      description: 'Button label text',
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    shape: 'standard',
    disabled: false,
    confirm: false,
    color: 'indigo',
    loading: false,
    label: 'Button text',
  },
};

export default meta;
type Story = StoryObj;

// --- Story 1: Interactive Playground ---

export const Playground: Story = {
  name: 'Playground',
  render: (args: any) => {
    const loadingSig: WritableSignal<boolean> = signal(args.loading);
    const options: IButtonOptions = {
      click: clickAction,
      variant: args.variant,
      size: args.size,
      color: args.color,
      confirm: args.confirm,
      loading: loadingSig,
    };

    if (args.shape === 'circular') {
      return {
        props: { options, isDisabled: args.disabled },
        template: `<smart-button-circular [options]="options" [disabled]="isDisabled">${iconPlus}</smart-button-circular>`,
      };
    }
    if (args.shape === 'rounded') {
      return {
        props: { options, isDisabled: args.disabled, label: args.label },
        template: `<smart-button-rounded [options]="options" [disabled]="isDisabled">{{ label }}</smart-button-rounded>`,
      };
    }
    return {
      props: { options, isDisabled: args.disabled, label: args.label },
      template: `<smart-button-standard [options]="options" [disabled]="isDisabled">{{ label }}</smart-button-standard>`,
    };
  },
};

// --- Story 2: All Variants ---

export const AllVariants: Story = {
  name: 'All Variants',
  argTypes: {
    variant: { table: { disable: true } },
    size: { table: { disable: true } },
    shape: { table: { disable: true } },
    disabled: { table: { disable: true } },
    confirm: { table: { disable: true } },
    color: { table: { disable: true } },
    loading: { table: { disable: true } },
    label: { table: { disable: true } },
  },
  render: () => {
    const opts = (overrides: Partial<IButtonOptions> = {}): IButtonOptions => ({
      click: clickAction,
      size: 'md',
      ...overrides,
    });

    const loadingSig = signal(true);

    return {
      props: {
        stdPrimary: opts({ variant: 'primary' }),
        stdSecondary: opts({ variant: 'secondary' }),
        stdSoft: opts({ variant: 'soft' }),
        rndPrimary: opts({ variant: 'primary' }),
        rndSecondary: opts({ variant: 'secondary' }),
        rndSoft: opts({ variant: 'soft' }),
        cirPrimary: opts({ variant: 'primary' }),
        cirSecondary: opts({ variant: 'secondary' }),
        cirSoft: opts({ variant: 'soft' }),
        stdXs: opts({ variant: 'primary', size: 'xs' }),
        stdSm: opts({ variant: 'primary', size: 'sm' }),
        stdMd: opts({ variant: 'primary', size: 'md' }),
        stdLg: opts({ variant: 'primary', size: 'lg' }),
        stdXl: opts({ variant: 'primary', size: 'xl' }),
        rndXs: opts({ variant: 'primary', size: 'xs' }),
        rndSm: opts({ variant: 'primary', size: 'sm' }),
        rndMd: opts({ variant: 'primary', size: 'md' }),
        rndLg: opts({ variant: 'primary', size: 'lg' }),
        rndXl: opts({ variant: 'primary', size: 'xl' }),
        cirXs: opts({ variant: 'primary', size: 'xs' }),
        cirSm: opts({ variant: 'primary', size: 'sm' }),
        cirMd: opts({ variant: 'primary', size: 'md' }),
        cirLg: opts({ variant: 'primary', size: 'lg' }),
        cirXl: opts({ variant: 'primary', size: 'xl' }),
        disabledOpts: opts({ variant: 'primary' }),
        loadingOpts: opts({ variant: 'primary', loading: loadingSig }),
        confirmOpts: opts({ variant: 'primary', confirm: true }),
        leadingOpts: opts({ variant: 'primary' }),
        trailingOpts: opts({ variant: 'primary' }),
        colRed: opts({ variant: 'primary', color: 'red' }),
        colOrange: opts({ variant: 'primary', color: 'orange' }),
        colGreen: opts({ variant: 'primary', color: 'green' }),
        colBlue: opts({ variant: 'primary', color: 'blue' }),
        colIndigo: opts({ variant: 'primary', color: 'indigo' }),
        colPurple: opts({ variant: 'primary', color: 'purple' }),
        colPink: opts({ variant: 'primary', color: 'pink' }),
        colSoftRed: opts({ variant: 'soft', color: 'red' }),
        colSoftOrange: opts({ variant: 'soft', color: 'orange' }),
        colSoftGreen: opts({ variant: 'soft', color: 'green' }),
        colSoftBlue: opts({ variant: 'soft', color: 'blue' }),
        colSoftIndigo: opts({ variant: 'soft', color: 'indigo' }),
        colSoftPurple: opts({ variant: 'soft', color: 'purple' }),
        colSoftPink: opts({ variant: 'soft', color: 'pink' }),
      },
      template: `
        <div style="display: flex; flex-direction: column; gap: 32px;">

          <section>
            <h3 style="margin-bottom: 12px; font-weight: 600;">Standard</h3>
            <div style="display: flex; align-items: center; gap: 12px;">
              <smart-button-standard [options]="stdPrimary">Primary</smart-button-standard>
              <smart-button-standard [options]="stdSecondary">Secondary</smart-button-standard>
              <smart-button-standard [options]="stdSoft">Soft</smart-button-standard>
            </div>
          </section>

          <section>
            <h3 style="margin-bottom: 12px; font-weight: 600;">Rounded</h3>
            <div style="display: flex; align-items: center; gap: 12px;">
              <smart-button-rounded [options]="rndPrimary">Primary</smart-button-rounded>
              <smart-button-rounded [options]="rndSecondary">Secondary</smart-button-rounded>
              <smart-button-rounded [options]="rndSoft">Soft</smart-button-rounded>
            </div>
          </section>

          <section>
            <h3 style="margin-bottom: 12px; font-weight: 600;">Circular</h3>
            <div style="display: flex; align-items: center; gap: 12px;">
              <smart-button-circular [options]="cirPrimary">${iconPlus}</smart-button-circular>
              <smart-button-circular [options]="cirSecondary">${iconPlus}</smart-button-circular>
              <smart-button-circular [options]="cirSoft">${iconPlus}</smart-button-circular>
            </div>
          </section>

          <section>
            <h3 style="margin-bottom: 12px; font-weight: 600;">Standard Sizes</h3>
            <div style="display: flex; align-items: center; gap: 12px;">
              <smart-button-standard [options]="stdXs">XS</smart-button-standard>
              <smart-button-standard [options]="stdSm">SM</smart-button-standard>
              <smart-button-standard [options]="stdMd">MD</smart-button-standard>
              <smart-button-standard [options]="stdLg">LG</smart-button-standard>
              <smart-button-standard [options]="stdXl">XL</smart-button-standard>
            </div>
          </section>

          <section>
            <h3 style="margin-bottom: 12px; font-weight: 600;">Rounded Sizes</h3>
            <div style="display: flex; align-items: center; gap: 12px;">
              <smart-button-rounded [options]="rndXs">XS</smart-button-rounded>
              <smart-button-rounded [options]="rndSm">SM</smart-button-rounded>
              <smart-button-rounded [options]="rndMd">MD</smart-button-rounded>
              <smart-button-rounded [options]="rndLg">LG</smart-button-rounded>
              <smart-button-rounded [options]="rndXl">XL</smart-button-rounded>
            </div>
          </section>

          <section>
            <h3 style="margin-bottom: 12px; font-weight: 600;">Circular Sizes</h3>
            <div style="display: flex; align-items: center; gap: 12px;">
              <smart-button-circular [options]="cirXs">${iconPlus}</smart-button-circular>
              <smart-button-circular [options]="cirSm">${iconPlus}</smart-button-circular>
              <smart-button-circular [options]="cirMd">${iconPlus}</smart-button-circular>
              <smart-button-circular [options]="cirLg">${iconPlus}</smart-button-circular>
              <smart-button-circular [options]="cirXl">${iconPlus}</smart-button-circular>
            </div>
          </section>

          <section>
            <h3 style="margin-bottom: 12px; font-weight: 600;">With Icons</h3>
            <div style="display: flex; align-items: center; gap: 12px;">
              <smart-button-standard [options]="leadingOpts">${iconCheck} Leading icon</smart-button-standard>
              <smart-button-standard [options]="trailingOpts">Trailing icon ${iconCheckTrailing}</smart-button-standard>
            </div>
          </section>

          <section>
            <h3 style="margin-bottom: 12px; font-weight: 600;">Colors (Primary)</h3>
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <smart-button-standard [options]="colRed">Red</smart-button-standard>
              <smart-button-standard [options]="colOrange">Orange</smart-button-standard>
              <smart-button-standard [options]="colGreen">Green</smart-button-standard>
              <smart-button-standard [options]="colBlue">Blue</smart-button-standard>
              <smart-button-standard [options]="colIndigo">Indigo</smart-button-standard>
              <smart-button-standard [options]="colPurple">Purple</smart-button-standard>
              <smart-button-standard [options]="colPink">Pink</smart-button-standard>
            </div>
          </section>

          <section>
            <h3 style="margin-bottom: 12px; font-weight: 600;">Colors (Soft)</h3>
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <smart-button-standard [options]="colSoftRed">Red</smart-button-standard>
              <smart-button-standard [options]="colSoftOrange">Orange</smart-button-standard>
              <smart-button-standard [options]="colSoftGreen">Green</smart-button-standard>
              <smart-button-standard [options]="colSoftBlue">Blue</smart-button-standard>
              <smart-button-standard [options]="colSoftIndigo">Indigo</smart-button-standard>
              <smart-button-standard [options]="colSoftPurple">Purple</smart-button-standard>
              <smart-button-standard [options]="colSoftPink">Pink</smart-button-standard>
            </div>
          </section>

          <section>
            <h3 style="margin-bottom: 12px; font-weight: 600;">States</h3>
            <div style="display: flex; align-items: center; gap: 12px;">
              <smart-button-standard [options]="disabledOpts" [disabled]="true">Disabled</smart-button-standard>
              <smart-button-standard [options]="loadingOpts">Loading</smart-button-standard>
              <smart-button-standard [options]="confirmOpts">Confirm (click me)</smart-button-standard>
            </div>
          </section>

        </div>
      `,
    };
  },
};
