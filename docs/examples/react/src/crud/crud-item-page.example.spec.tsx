import { act, fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { NoteRoute } from './crud-item-page.example';
import { createFakeApi, FakeApi } from './fake-api';

const API = 'https://api.example.com/notes';
const NOTES = [{ id: '1', title: 'Shopping', content: 'Milk' }];

describe('docs-examples-react: NoteRoute', () => {
  let api: FakeApi;

  function setup(path: string, id?: string) {
    api = createFakeApi(API, NOTES);
    window.history.pushState(null, '', path);

    render(
      <SmartProvider
        language="eng"
        http={api.http}
        translations={{ MODEL: { title: 'Title', content: 'Content' } }}
      >
        <NoteRoute id={id} />
      </SmartProvider>,
    );
  }

  /** Lets the pending requests and the effects after them settle. */
  const settle = () =>
    act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

  afterEach(() => {
    window.history.pushState(null, '', '/');
  });

  describe('without an id', () => {
    it('should render an empty form in create mode', async () => {
      setup('/notes/add');

      expect(screen.getByRole('heading', { name: 'add' })).toBeInTheDocument();
      expect(await screen.findByLabelText(/Title/)).toHaveValue('');
    });

    it('should create the note and return to the list', async () => {
      setup('/notes/add');

      fireEvent.change(await screen.findByLabelText(/Title/), {
        target: { value: 'Groceries' },
      });
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'add' }));
      });
      await settle();

      expect(api.requests[0]).toEqual(
        expect.objectContaining({
          method: 'POST',
          url: API,
          body: expect.objectContaining({ title: 'Groceries' }),
        }),
      );
      expect(window.location.pathname).toBe('/notes');
    });
  });

  describe('with an id', () => {
    it('should select the note by its id', async () => {
      setup('/notes/1', '1');
      await screen.findByText('Milk');

      expect(api.calls()).toEqual([`GET ${API}/1`]);
    });

    it('should open read-only, titled by the titleKey of the model', async () => {
      setup('/notes/1', '1');

      expect(
        await screen.findByRole('heading', { name: 'Shopping - details' }),
      ).toBeInTheDocument();
      expect(screen.getByText('Milk')).toBeInTheDocument();
      expect(screen.queryByLabelText(/Title/)).not.toBeInTheDocument();
    });

    it('should switch to the form in place from the edit button', async () => {
      setup('/notes/1', '1');
      await screen.findByText('Milk');

      fireEvent.click(screen.getByRole('button', { name: 'edit' }));

      expect(
        await screen.findByRole('heading', { name: 'Shopping - change' }),
      ).toBeInTheDocument();
      expect(await screen.findByLabelText(/Title/)).toHaveValue('Shopping');
    });

    it('should open the form directly with the edit query parameter', async () => {
      setup('/notes/1?edit=1', '1');

      expect(
        await screen.findByRole('heading', { name: 'Shopping - change' }),
      ).toBeInTheDocument();
    });

    it('should save the changed fields with the id and return to the details', async () => {
      setup('/notes/1?edit=1', '1');

      // The form is built again once the selected note arrives.
      fireEvent.change(await screen.findByDisplayValue('Shopping'), {
        target: { value: 'Groceries' },
      });
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'save' }));
      });
      await settle();

      expect(api.requests[1]).toEqual(
        expect.objectContaining({
          method: 'PATCH',
          url: `${API}/1`,
          body: { title: 'Groceries', id: '1' },
        }),
      );
      expect(
        screen.getByRole('heading', { name: 'Shopping - details' }),
      ).toBeInTheDocument();
    });

    it('should return to the details without saving from the cancel button', async () => {
      setup('/notes/1?edit=1', '1');
      await screen.findByLabelText(/Title/);

      fireEvent.click(screen.getByRole('button', { name: 'cancel' }));

      expect(
        screen.getByRole('heading', { name: 'Shopping - details' }),
      ).toBeInTheDocument();
      expect(api.calls()).toEqual([`GET ${API}/1`]);
    });
  });
});
