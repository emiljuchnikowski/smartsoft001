import { render, screen } from '@testing-library/react';

import {
  SmartButton,
  SmartButtonPreset,
  useFileService,
  useTranslate,
} from '@smartsoft001/react';

import { AppProviders } from './app-providers.example';

describe('docs-examples-react: AppProviders', () => {
  it('should translate with the English dictionary', () => {
    const Probe = () => <span>{useTranslate()('save')}</span>;

    render(
      <AppProviders>
        <Probe />
      </AppProviders>,
    );

    expect(screen.getByText('save')).toBeInTheDocument();
  });

  it('should point the file service at the API', () => {
    const Probe = () => <span>{useFileService()?.getUrl('1')}</span>;

    render(
      <AppProviders>
        <Probe />
      </AppProviders>,
    );

    expect(screen.getByText('/api/attachments/1')).toBeInTheDocument();
  });

  it('should render buttons with the preset', () => {
    render(
      <AppProviders>
        <SmartButton options={{ click: () => undefined }}>Save</SmartButton>
      </AppProviders>,
    );
    const { container } = render(
      <SmartButtonPreset options={{ click: () => undefined }}>
        Save
      </SmartButtonPreset>,
    );

    expect(screen.getAllByRole('button', { name: 'Save' })[0].className).toBe(
      (container.querySelector('button') as HTMLButtonElement).className,
    );
  });
});
