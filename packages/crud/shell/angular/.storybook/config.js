import { withKnobs } from '@storybook/addon-knobs';
import { configure, addDecorator } from '@storybook/angular';

addDecorator(withKnobs);
configure(require.context('../src/lib', true, /\.stories\.(j|t)sx?$/), module);
