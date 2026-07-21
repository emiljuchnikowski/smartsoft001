import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { MediaObjectComponent } from './media-object.component';
import { MediaObjectPresetComponent } from './preset/preset.component';
import { MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const IMAGE =
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80';

const meta: Meta<MediaObjectComponent> = {
  title: 'Components/MediaObject',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [MediaObjectComponent],
      // Register the preset variation as the replacement for the standard
      // media object, so every <smart-media-object> renders the preset.
      providers: [
        {
          provide: MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN,
          useValue: MediaObjectPresetComponent,
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<MediaObjectComponent>;

export const Preset: Story = {
  name: 'Preset',
  render: () => ({
    props: { image: IMAGE },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 40px; max-width: 640px;">
        <smart-media-object
          [mediaUrl]="image"
          mediaAlt="Portrait"
          [options]="{ alignment: 'center' }"
        >
          <h3 class="smart:font-semibold smart:text-gray-900 smart:dark:text-white">Default (media left)</h3>
          <p>Rounded thumbnail beside the projected body, centered on the cross axis.</p>
        </smart-media-object>

        <smart-media-object
          [mediaUrl]="image"
          mediaAlt="Portrait"
          [options]="{ position: 'right', alignment: 'top' }"
        >
          <h3 class="smart:font-semibold smart:text-gray-900 smart:dark:text-white">Media right, top aligned</h3>
          <p>The row reverses so the media sits on the trailing edge.</p>
        </smart-media-object>

        <smart-media-object
          [mediaUrl]="image"
          mediaAlt="Portrait"
          [options]="{ wide: true }"
        >
          <h3 class="smart:font-semibold smart:text-gray-900 smart:dark:text-white">Wide media</h3>
          <p>A wider thumbnail footprint for landscape imagery.</p>
        </smart-media-object>

        <smart-media-object
          [mediaUrl]="image"
          mediaAlt="Portrait"
          [options]="{ responsive: true }"
        >
          <h3 class="smart:font-semibold smart:text-gray-900 smart:dark:text-white">Responsive</h3>
          <p>Stacks into a column on mobile, then rows out from the sm breakpoint.</p>
        </smart-media-object>

        <smart-media-object
          [mediaUrl]="image"
          mediaAlt="Portrait"
          [options]="{ alignment: 'stretched' }"
        >
          <h3 class="smart:font-semibold smart:text-gray-900 smart:dark:text-white">Stretched</h3>
          <p>The media fills the full height of the row.</p>
        </smart-media-object>
      </div>
    `,
  }),
};
