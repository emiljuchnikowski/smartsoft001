import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { CalendarComponent } from './calendar.component';
import { CalendarPresetComponent } from './preset/preset.component';
import { ICalendarEvent } from '../../models';
import { CALENDAR_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

interface CalendarArgs {
  weekStart: 0 | 1;
  showToolbar: boolean;
  selected: boolean;
}

// Dates anchored to the current month so the rendered grid always shows them.
const today = new Date();
const inThisMonth = (day: number) =>
  new Date(today.getFullYear(), today.getMonth(), day);

const meta: Meta<CalendarArgs> = {
  title: 'Components/Calendar',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CalendarComponent],
      // Register the preset variation as the replacement for the standard
      // calendar, so every <smart-calendar> renders CalendarPresetComponent.
      providers: [
        {
          provide: CALENDAR_STANDARD_COMPONENT_TOKEN,
          useValue: CalendarPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    weekStart: { control: 'radio', options: [1, 0] },
    showToolbar: { control: 'boolean' },
    selected: { control: 'boolean' },
  },
  args: {
    weekStart: 1,
    showToolbar: true,
    selected: true,
  },
};

export default meta;
type Story = StoryObj<CalendarArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      value: args.selected ? today : null,
      options: {
        weekStart: args.weekStart,
        showToolbar: args.showToolbar,
      },
    },
    template: `
      <div style="padding: 40px;">
        <smart-calendar
          [value]="value"
          [options]="options"
        ></smart-calendar>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      today,
      events: [
        { id: 1, start: inThisMonth(8) },
        { id: 2, start: inThisMonth(8) },
        { id: 3, start: inThisMonth(17) },
        { id: 4, start: inThisMonth(24) },
      ] as ICalendarEvent[],
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 32px; padding: 24px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Default (Monday start)</h3>
          <smart-calendar></smart-calendar>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Pre-selected day</h3>
          <smart-calendar [value]="today"></smart-calendar>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With event markers</h3>
          <smart-calendar [events]="events"></smart-calendar>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Sunday start</h3>
          <smart-calendar [options]="{ weekStart: 0 }"></smart-calendar>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">No toolbar</h3>
          <smart-calendar [options]="{ showToolbar: false }"></smart-calendar>
        </section>

      </div>
    `,
  }),
};
