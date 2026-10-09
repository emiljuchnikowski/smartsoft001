import { render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { NotesList } from './crud-facade.example';
import { createFakeApi, FakeApi } from './fake-api';

const API = 'https://api.example.com/notes';
const NOTES = [
  { id: '1', title: 'Shopping', content: 'Milk' },
  { id: '2', title: 'Ideas', content: 'Write docs' },
];

describe('docs-examples-react: NotesList', () => {
  let api: FakeApi;

  function setup() {
    api = createFakeApi(API, NOTES);

    render(
      <SmartProvider http={api.http}>
        <NotesList />
      </SmartProvider>,
    );
  }

  it('should load the collection once on mount', async () => {
    setup();
    await screen.findByText('Shopping');

    expect(api.calls()).toHaveLength(1);
  });

  it('should read with an empty filter', async () => {
    setup();
    await screen.findByText('Shopping');

    expect(api.calls()).toEqual([`GET ${API}`]);
  });

  it('should render one row per item of the list', async () => {
    setup();

    expect(await screen.findAllByRole('listitem')).toHaveLength(2);
  });

  it('should render the title of each item', async () => {
    setup();

    const rows = await screen.findAllByRole('listitem');

    expect(rows.map((row) => row.textContent)).toEqual(['Shopping', 'Ideas']);
  });

  it('should render a loading message until the first read settles', async () => {
    setup();

    expect(screen.getByText('Loading notes…')).toBeInTheDocument();

    await screen.findByText('Shopping');

    expect(screen.queryByText('Loading notes…')).not.toBeInTheDocument();
  });

  it('should render no rows while the list is still undefined', async () => {
    setup();

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);

    await screen.findByText('Shopping');
  });
});
