import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { SmartHttpClient, SmartProvider } from '@smartsoft001/react';

import { RecentNotes } from './recent-notes.example';

const NOTES = [
  { id: '1', title: 'First note' },
  { id: '2', title: 'Second note' },
];

const LIST_URL = '/api/notes?limit=5&offset=0&archived=false';

/** A `fetch` answering the notes API from memory. */
function createFetch() {
  return jest.fn(async (url: string, init: { method: string }) => {
    const body =
      init.method === 'GET'
        ? { data: NOTES, totalCount: NOTES.length, links: {} }
        : null;

    return {
      ok: true,
      status: 200,
      headers: { get: () => null },
      text: async () => (body ? JSON.stringify(body) : ''),
    };
  });
}

function setup() {
  const fetchMock = createFetch();
  const http = new SmartHttpClient({
    fetch: fetchMock as unknown as typeof fetch,
  });

  render(
    <SmartProvider language="eng" http={http}>
      <RecentNotes />
    </SmartProvider>,
  );

  return fetchMock;
}

describe('docs-examples-react: RecentNotes', () => {
  it('should show the loading text until the first read settles', async () => {
    setup();

    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(await screen.findByText('First note')).toBeInTheDocument();
  });

  it('should read five notes with the base query', async () => {
    const fetchMock = setup();

    await screen.findByText('First note');

    expect(fetchMock).toHaveBeenCalledWith(
      LIST_URL,
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('should render a title per note', async () => {
    setup();

    expect(await screen.findByText('Second note')).toBeInTheDocument();
  });

  it('should delete a note and read the first page again', async () => {
    const fetchMock = setup();

    await screen.findByText('First note');
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
    expect(
      fetchMock.mock.calls.map(([url, init]) => [init.method, url]),
    ).toEqual([
      ['GET', LIST_URL],
      ['DELETE', '/api/notes/1'],
      ['GET', LIST_URL],
    ]);
  });
});
