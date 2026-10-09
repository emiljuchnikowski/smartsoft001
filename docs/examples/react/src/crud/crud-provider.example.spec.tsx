import { render, screen } from '@testing-library/react';

import { CrudProvider, useCrudConfig } from '@smartsoft001/crud-shell-react';
import { SmartProvider, useFileService } from '@smartsoft001/react';

import { noteCrudConfig } from './crud-config.example';
import { App } from './crud-provider.example';
import { createFakeApi, FakeApi } from './fake-api';

const API = 'https://api.example.com/notes';
const NOTES = [
  { id: '1', title: 'Shopping', content: 'Milk' },
  { id: '2', title: 'Ideas', content: 'Write docs' },
];

describe('docs-examples-react: NotesFeature', () => {
  const originalFetch = globalThis.fetch;
  let api: FakeApi;

  function renderAt(path: string) {
    window.history.pushState(null, '', path);
    render(<App />);
  }

  beforeEach(() => {
    api = createFakeApi(API, NOTES);
    globalThis.fetch = api.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    window.history.pushState(null, '', '/');
  });

  it('should render the list page on the base path', async () => {
    renderAt('/notes');

    expect(await screen.findByText('Shopping')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Notes' })).toBeInTheDocument();
  });

  it('should read the first page with the page size and sort of the config', async () => {
    renderAt('/notes');
    await screen.findByText('Shopping');

    expect(api.calls()).toEqual([`GET ${API}?limit=25&offset=0&sort=title`]);
  });

  it('should render the item page creating a note on the add path', async () => {
    renderAt('/notes/add');

    expect(screen.getByRole('heading', { name: 'add' })).toBeInTheDocument();
    expect(await screen.findByLabelText(/Title/)).toBeInTheDocument();
  });

  it('should render the item page of a note on its own path', async () => {
    renderAt('/notes/1');

    expect(
      await screen.findByRole('heading', { name: 'Shopping - change' }),
    ).toBeInTheDocument();
    expect(api.calls()).toEqual([`GET ${API}/1`]);
  });

  it('should render no page on a path outside the base path', () => {
    renderAt('/settings');

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(api.calls()).toEqual([]);
  });

  it('should provide the config to the components of the feature', () => {
    const Probe = () => <span>{useCrudConfig().entity}</span>;

    render(
      <SmartProvider>
        <CrudProvider config={noteCrudConfig}>
          <Probe />
        </CrudProvider>
      </SmartProvider>,
    );

    expect(screen.getByText('notes')).toBeInTheDocument();
  });

  it('should point the file service of the feature at the apiUrl', () => {
    const Probe = () => <span>{useFileService()?.getUrl('7')}</span>;

    render(
      <SmartProvider>
        <CrudProvider config={noteCrudConfig}>
          <Probe />
        </CrudProvider>
      </SmartProvider>,
    );

    expect(screen.getByText(`${API}/attachments/7`)).toBeInTheDocument();
  });
});
