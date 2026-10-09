import { act, fireEvent, render, screen, within } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { TasksScreen } from './crud-export-multiselect.example';
import { createFakeApi, FakeApi } from './fake-api';

const API = 'https://api.example.com/tasks';

/** Lets the timers and the requests they start settle. */
const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

describe('docs-examples-react: TasksScreen', () => {
  let api: FakeApi;

  async function setup(owners = ['Ann', 'Ann']) {
    api = createFakeApi(API, [
      { id: '1', title: 'Write docs', owner: owners[0] },
      { id: '2', title: 'Review', owner: owners[1] },
    ]);
    window.history.pushState(null, '', '/tasks');

    render(
      <SmartProvider
        language="eng"
        http={api.http}
        translations={{ MODEL: { title: 'Title', owner: 'Owner' } }}
      >
        <TasksScreen />
      </SmartProvider>,
    );

    await screen.findByText('Write docs');
  }

  afterEach(() => {
    window.history.pushState(null, '', '/');
  });

  describe('export', () => {
    const createObjectURL = URL.createObjectURL;
    let downloads: string[];

    beforeEach(() => {
      downloads = [];
      URL.createObjectURL = () => 'blob:tasks';
      jest
        .spyOn(HTMLAnchorElement.prototype, 'click')
        .mockImplementation(function (this: HTMLAnchorElement) {
          downloads.push(this.download);
        });
    });

    afterEach(() => {
      URL.createObjectURL = createObjectURL;
      jest.restoreAllMocks();
    });

    async function exportAs(format: 'CSV' | 'XLSX') {
      fireEvent.click(screen.getByRole('button', { name: 'export' }));
      fireEvent.click(await screen.findByRole('button', { name: format }));
      await settle();
    }

    it('should offer CSV and XLSX in a modal', async () => {
      await setup();

      fireEvent.click(screen.getByRole('button', { name: 'export' }));

      expect(
        await screen.findByRole('button', { name: 'CSV' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'XLSX' })).toBeInTheDocument();
    });

    it('should request the current filter without paging as CSV', async () => {
      await setup();

      await exportAs('CSV');

      expect(api.requests[1]).toEqual(
        expect.objectContaining({
          method: 'GET',
          url: API,
          headers: { 'Content-Type': 'text/csv' },
        }),
      );
    });

    it('should hand the browser the file as data.csv', async () => {
      await setup();

      await exportAs('CSV');

      expect(downloads).toEqual(['data.csv']);
    });

    it('should close the modal once the export finished', async () => {
      await setup();

      await exportAs('XLSX');

      expect(
        screen.queryByRole('button', { name: 'XLSX' }),
      ).not.toBeInTheDocument();
      expect(downloads).toEqual(['data.xlsx']);
    });
  });

  describe('multiselect', () => {
    /** Turns on the multi selection and checks the rows at `indexes`. */
    async function select(...indexes: number[]) {
      fireEvent.click(screen.getByRole('button', { name: 'multi' }));
      await settle();

      const boxes = screen.getAllByRole('checkbox');

      for (const index of indexes) {
        await act(async () => {
          fireEvent.click(boxes[index]);
        });
      }

      return screen.findByRole('complementary', { name: 'End menu' });
    }

    it('should switch the list into multi selection from its button', async () => {
      await setup();

      expect(screen.queryAllByRole('checkbox')).toHaveLength(0);

      fireEvent.click(screen.getByRole('button', { name: 'multi' }));
      await settle();

      expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    });

    it('should open the panel in the end menu with the selection', async () => {
      await setup();

      const menu = await select(0);

      expect(
        within(menu).getByRole('heading', { name: 'selected: 1' }),
      ).toBeInTheDocument();
    });

    it('should prefill a value every selected record shares', async () => {
      await setup(['Ann', 'Ann']);

      const menu = await select(0, 1);

      expect(await within(menu).findByLabelText(/Owner/)).toHaveValue('Ann');
    });

    it('should leave a value the selected records do not share empty', async () => {
      await setup(['Ann', 'Bob']);

      const menu = await select(0, 1);

      expect(await within(menu).findByLabelText(/Owner/)).toHaveValue('');
    });

    it('should apply the change to every selected record', async () => {
      await setup();
      const menu = await select(0, 1);

      fireEvent.change(await within(menu).findByLabelText(/Owner/), {
        target: { value: 'Eve' },
      });
      fireEvent.click(within(menu).getByRole('button', { name: 'change' }));
      await act(async () => {
        fireEvent.click(within(menu).getByRole('button', { name: 'confirm' }));
      });
      await settle();

      expect(
        api.requests
          .filter((request) => request.method === 'PATCH')
          .map(({ url, body }) => [url, body]),
      ).toEqual([
        [`${API}/1`, { owner: 'Eve', id: '1' }],
        [`${API}/2`, { owner: 'Eve', id: '2' }],
      ]);
      expect(
        screen.queryByRole('complementary', { name: 'End menu' }),
      ).not.toBeInTheDocument();
    });
  });
});
