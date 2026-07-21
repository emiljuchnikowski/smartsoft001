import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { PageHeadingComponent } from './page-heading.component';
import { PageHeadingPresetComponent } from './preset/preset.component';
import { PAGE_HEADING_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const meta: Meta = {
  title: 'Components/Page heading',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [PageHeadingComponent],
      // Register the HyperUI preset as the replacement for the standard
      // page-heading, so every <smart-page-heading> renders the navbar look.
      providers: [
        {
          provide: PAGE_HEADING_STANDARD_COMPONENT_TOKEN,
          useValue: PageHeadingPresetComponent,
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj;

export const Preset: Story = {
  name: 'Preset (HyperUI)',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <ng-template #logo>
        <a class="smart:block smart:text-teal-600 smart:dark:text-teal-300" href="#">
          <span class="smart:text-lg smart:font-bold">Acme</span>
        </a>
      </ng-template>

      <ng-template #nav>
        <ul class="smart:flex smart:items-center smart:gap-6 smart:text-sm">
          <li><a class="smart:text-gray-500 smart:transition smart:hover:text-gray-500/75 smart:dark:text-white smart:dark:hover:text-white/75" href="#">About</a></li>
          <li><a class="smart:text-gray-500 smart:transition smart:hover:text-gray-500/75 smart:dark:text-white smart:dark:hover:text-white/75" href="#">Careers</a></li>
          <li><a class="smart:text-gray-500 smart:transition smart:hover:text-gray-500/75 smart:dark:text-white smart:dark:hover:text-white/75" href="#">Contact</a></li>
        </ul>
      </ng-template>

      <ng-template #actions>
        <a class="smart:rounded-md smart:bg-teal-600 smart:px-5 smart:py-2.5 smart:text-sm smart:font-medium smart:text-white smart:shadow-sm smart:transition smart:hover:bg-teal-700 smart:dark:hover:bg-teal-500" href="#">Login</a>
        <a class="smart:rounded-md smart:bg-gray-100 smart:px-5 smart:py-2.5 smart:text-sm smart:font-medium smart:text-teal-600 smart:dark:bg-gray-800 smart:dark:text-white smart:dark:hover:text-white/75" href="#">Register</a>
      </ng-template>

      <ng-template #avatar>
        <img
          class="smart:size-10 smart:rounded-full smart:object-cover"
          src="https://avatars.githubusercontent.com/u/10416742?s=200&v=4"
          alt="User"
        />
      </ng-template>

      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">
        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Links left (default)</h3>
          <smart-page-heading
            [options]="{ logoTpl: logo, navTpl: nav, actionsTpl: actions, presentation: { layout: 'links-left' } }"
          />
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">User (avatar)</h3>
          <smart-page-heading
            [options]="{ logoTpl: logo, navTpl: nav, avatarTpl: avatar, presentation: { layout: 'user' } }"
          />
        </section>
      </div>
    `,
  }),
};
