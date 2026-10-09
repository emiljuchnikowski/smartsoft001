import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { ArticlesWithFilters } from './crud-filters.example';
import { createFakeApi, FakeApi } from './fake-api';

const API = 'https://api.example.com/articles';
const ARTICLES = [
  { id: '1', title: 'Milk prices' },
  { id: '2', title: 'Release notes' },
];

describe('docs-examples-react: ArticlesWithFilters', () => {
  let api: FakeApi;

  async function setup() {
    api = createFakeApi(API, ARTICLES);
    window.history.pushState(null, '', '/articles');

    render(
      <SmartProvider
        language="eng"
        http={api.http}
        translations={{ MODEL: { title: 'Title' } }}
      >
        <ArticlesWithFilters />
      </SmartProvider>,
    );

    await screen.findByText('Milk prices');
  }

  /** Types into the text filter of the title and waits for its read. */
  async function filterByTitle(text: string) {
    fireEvent.change(screen.getByLabelText(/Title/), {
      target: { value: text },
    });

    await waitFor(() => expect(api.requests).toHaveLength(2), {
      timeout: 2000,
    });
    await screen.findByText('Milk prices');
  }

  afterEach(() => {
    window.history.pushState(null, '', '/');
  });

  it('should send the base query with the first read', async () => {
    await setup();

    expect(api.calls()).toEqual([
      `GET ${API}?limit=10&offset=0&archived=false`,
    ]);
  });

  it('should send the search text as $search from the first page', async () => {
    await setup();

    fireEvent.change(screen.getByPlaceholderText('search'), {
      target: { value: 'milk' },
    });
    await screen.findByText('Milk prices');

    expect(api.calls()[1]).toBe(
      `GET ${API}?$search=milk&limit=10&offset=0&archived=false`,
    );
  });

  it('should read with a contains filter after the debounce', async () => {
    await setup();

    await filterByTitle('milk');

    expect(api.calls()[1]).toBe(
      `GET ${API}?limit=10&offset=0&archived=false&title~=milk`,
    );
  });

  it('should keep the hidden base query out of the chips', async () => {
    await setup();

    expect(
      screen.queryByRole('button', { name: /^remove/ }),
    ).not.toBeInTheDocument();
  });

  it('should show the active filter as a chip that removes it', async () => {
    await setup();
    await filterByTitle('milk');

    fireEvent.click(screen.getByRole('button', { name: 'remove Title' }));
    await waitFor(() => expect(api.requests).toHaveLength(3));
    await screen.findByText('Milk prices');

    expect(api.calls()[2]).toBe(`GET ${API}?limit=10&offset=0&archived=false`);
  });
});
