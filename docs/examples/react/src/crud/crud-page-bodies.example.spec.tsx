import { act, fireEvent, render, screen, within } from '@testing-library/react';

import { NoteRoute } from './crud-item-page.example';
import { NotesListRoute } from './crud-list-page.example';
import { AppProviders } from './crud-page-bodies.example';
import { createFakeApi, FakeApi } from './fake-api';

const API = 'https://api.example.com/notes';
const NOTES = [
  { id: '1', title: 'Shopping', content: 'Milk' },
  { id: '2', title: 'Ideas', content: 'Write docs' },
];

describe('docs-examples-react: AppProviders with page bodies', () => {
  const originalFetch = globalThis.fetch;
  let api: FakeApi;

  beforeEach(() => {
    api = createFakeApi(API, NOTES);
    globalThis.fetch = api.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    window.history.pushState(null, '', '/');
  });

  describe('the list page', () => {
    function setup() {
      window.history.pushState(null, '', '/notes');
      const { container } = render(
        <AppProviders>
          <NotesListRoute />
        </AppProviders>,
      );

      return container;
    }

    it('should render the registered body in the dynamic content element', async () => {
      const container = setup();
      await screen.findByText('Shopping');

      const dynamic = container.querySelector(
        '.dynamic-content',
      ) as HTMLElement;

      expect(within(dynamic).getByText('Ideas')).toBeInTheDocument();
    });

    it('should hand the body the list options of the page', async () => {
      setup();
      await screen.findByText('Shopping');

      expect(api.calls()).toEqual([`GET ${API}?limit=25&offset=0&sort=title`]);
    });

    it('should replace the table of the standard body', async () => {
      setup();
      await screen.findByText('Shopping');

      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('should keep the page around the body', async () => {
      setup();
      await screen.findByText('Shopping');

      expect(
        screen.getByRole('heading', { name: 'Notes' }),
      ).toBeInTheDocument();
    });
  });

  describe('the item page', () => {
    it('should render the registered form', async () => {
      window.history.pushState(null, '', '/notes/add');
      render(
        <AppProviders>
          <NoteRoute />
        </AppProviders>,
      );

      const form = await screen.findByRole('region', { name: 'Note form' });

      expect(within(form).getByLabelText(/Title/)).toBeInTheDocument();
    });

    it('should render the read-only view of a record', async () => {
      window.history.pushState(null, '', '/notes/1');
      const { container } = render(
        <AppProviders>
          <NoteRoute id="1" />
        </AppProviders>,
      );

      const dynamic = container.querySelector(
        '.dynamic-content',
      ) as HTMLElement;

      expect(await within(dynamic).findByText('Milk')).toBeInTheDocument();
      expect(
        screen.queryByRole('region', { name: 'Note form' }),
      ).not.toBeInTheDocument();
    });

    it('should create through the form the body put into formRef', async () => {
      window.history.pushState(null, '', '/notes/add');
      render(
        <AppProviders>
          <NoteRoute />
        </AppProviders>,
      );

      fireEvent.change(await screen.findByLabelText(/Title/), {
        target: { value: 'Groceries' },
      });
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'add' }));
      });

      expect(api.requests[0]).toEqual(
        expect.objectContaining({
          method: 'POST',
          url: API,
          body: expect.objectContaining({ title: 'Groceries' }),
        }),
      );
    });
  });
});
