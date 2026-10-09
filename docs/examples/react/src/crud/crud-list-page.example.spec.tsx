import { act, fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { NotesListRoute } from './crud-list-page.example';
import { createFakeApi, FakeApi } from './fake-api';

const API = 'https://api.example.com/notes';
const NOTES = [
  { id: '1', title: 'Shopping', content: 'Milk' },
  { id: '2', title: 'Ideas', content: 'Write docs' },
];

/**
 * The page runs on the real store and effects: the only stand-in is the
 * `fetch` under the provider's HTTP client, so the spec needs no mock of the
 * facade, the router or the services.
 */
describe('docs-examples-react: NotesListRoute', () => {
  let api: FakeApi;

  async function setup() {
    api = createFakeApi(API, NOTES);
    window.history.pushState(null, '', '/notes');

    render(
      <SmartProvider
        language="eng"
        http={api.http}
        translations={{ MODEL: { title: 'Title', content: 'Content' } }}
      >
        <NotesListRoute />
      </SmartProvider>,
    );

    await screen.findByText('Shopping');
  }

  afterEach(() => {
    window.history.pushState(null, '', '/');
  });

  it('should load the collection through the facade on mount', async () => {
    await setup();

    expect(api.calls()).toHaveLength(1);
  });

  it('should read with the page size and the default sort of the config', async () => {
    await setup();

    expect(api.calls()).toEqual([`GET ${API}?limit=25&offset=0&sort=title`]);
  });

  it('should render the config title as the page heading', async () => {
    await setup();

    expect(screen.getByRole('heading', { name: 'Notes' })).toBeInTheDocument();
  });

  it('should render the search box because the config sets search', async () => {
    await setup();

    expect(screen.getByPlaceholderText('search')).toBeInTheDocument();
  });

  it('should render a table column per field marked list in the model', async () => {
    await setup();

    expect(
      screen.getAllByRole('columnheader').map((th) => th.textContent),
    ).toEqual(expect.arrayContaining(['Title', 'Content']));
  });

  it('should navigate to the add path from the add button', async () => {
    await setup();

    // A navigation closes the end menu and ends the multi selection.
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'add' }));
    });

    expect(window.location.pathname).toBe('/notes/add');
  });

  it('should link each row to the path of its record', async () => {
    await setup();

    await act(async () => {
      fireEvent.click(screen.getAllByRole('button', { name: '→' })[0]);
    });

    expect(window.location.pathname).toBe('/notes/1');
  });
});
