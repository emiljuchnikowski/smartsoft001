import { act, fireEvent, render, screen } from '@testing-library/react';

import { NotesApp } from './notes-screens.example';

const NOTES = [
  { id: '1', title: 'First note' },
  { id: '2', title: 'Second note' },
];

/** A `fetch` answering the notes API from memory. */
function createFetch() {
  return jest.fn(async (url: string, init: { method: string }) => {
    const id = /^\/api\/notes\/([^/?]+)$/.exec(url)?.[1];
    const body =
      init.method === 'GET' && id
        ? NOTES.find((note) => note.id === id)
        : { data: NOTES, totalCount: NOTES.length, links: {} };

    return {
      ok: true,
      status: 200,
      headers: { get: () => null },
      text: async () => JSON.stringify(body),
    };
  });
}

/** Lets the pending requests settle. */
const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

describe('docs-examples-react: NotesApp', () => {
  const originalFetch = globalThis.fetch;
  let fetchMock: ReturnType<typeof createFetch>;

  beforeEach(() => {
    fetchMock = createFetch();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    window.history.pushState(null, '', '/notes');
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    window.history.pushState(null, '', '/');
  });

  it('should read the first page sorted by the default column', async () => {
    render(<NotesApp />);
    await screen.findByText('First note');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/notes?limit=10&offset=0&sort=title',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('should render a row per note on the list path', async () => {
    render(<NotesApp />);

    expect(await screen.findByText('Second note')).toBeInTheDocument();
  });

  it('should open the details of a note on its own path', async () => {
    render(<NotesApp />);
    await screen.findByText('First note');

    fireEvent.click(screen.getAllByRole('button', { name: '→' })[0]);
    await settle();

    expect(window.location.pathname).toBe('/notes/1');
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/notes/1',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(
      await screen.findByRole('heading', { name: 'First note - details' }),
    ).toBeInTheDocument();
  });
});
