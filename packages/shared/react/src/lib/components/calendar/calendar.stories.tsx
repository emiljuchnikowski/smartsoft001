import type { Meta, StoryObj } from '@storybook/react-vite';

import { SmartCalendar } from './calendar';
import { ICalendarEvent } from '../../models';
import { SmartCalendarPreset } from './preset/calendar-preset';

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
  // Register the preset variation as the replacement for the standard
  // calendar, so every <SmartCalendar> renders SmartCalendarPreset.
  parameters: {
    smart: { components: { calendar: SmartCalendarPreset } },
  },
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

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40 }}>
      <SmartCalendar
        // Remounts when the `selected` control changes, so it becomes the new
        // initial selection; clicks select a day inside the calendar.
        key={String(args.selected)}
        defaultValue={args.selected ? today : null}
        options={{
          weekStart: args.weekStart,
          showToolbar: args.showToolbar,
        }}
      />
    </div>
  ),
};
// #endregion

const events: ICalendarEvent[] = [
  { id: 1, start: inThisMonth(8) },
  { id: 2, start: inThisMonth(8) },
  { id: 3, start: inThisMonth(17) },
  { id: 4, start: inThisMonth(24) },
];

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, padding: 24 }}>
      <section>
        <h3 style={sectionTitle}>Default (Monday start)</h3>
        <SmartCalendar />
      </section>

      <section>
        <h3 style={sectionTitle}>Day already selected</h3>
        <SmartCalendar defaultValue={today} />
      </section>

      <section>
        <h3 style={sectionTitle}>With event markers</h3>
        <SmartCalendar events={events} />
      </section>

      <section>
        <h3 style={sectionTitle}>Sunday start</h3>
        <SmartCalendar options={{ weekStart: 0 }} />
      </section>

      <section>
        <h3 style={sectionTitle}>No toolbar</h3>
        <SmartCalendar options={{ showToolbar: false }} />
      </section>
    </div>
  ),
};
