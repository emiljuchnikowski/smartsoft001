import { act, fireEvent, render, screen } from '@testing-library/react';

import {
  ModalService,
  SmartProvider,
  useModalService,
  useStyleService,
} from '@smartsoft001/react';

import { SmartCrudExport } from './export';
import { SmartCrudExportProps } from './export.types';
import { useCrudFacade } from '../../crud.context';
import { CrudProvider } from '../../crud.provider';
import { ICrudFilter } from '../../models';
import { CrudService } from '../../services/crud/crud.service';
import { CrudFacade } from '../../state/crud.facade';

class TodoModel {
  id!: string;
}

const config = {
  apiUrl: '/api/todos',
  entity: 'todos-export',
  type: TodoModel,
};

function setup(
  filter: ICrudFilter = {},
  props: SmartCrudExportProps = {},
  exportList: () => Promise<void> = async () => undefined,
) {
  let facade!: CrudFacade<TodoModel>;
  let modalService!: ModalService;
  const Grab = () => {
    facade = useCrudFacade();
    modalService = useModalService();
    useStyleService().set({ 'color-primary': '#ff0000' });
    return null;
  };
  const service = {
    exportList: jest.fn(exportList),
  } as unknown as CrudService<TodoModel>;

  const view = render(
    <SmartProvider>
      <CrudProvider config={config} service={service}>
        <Grab />
        <SmartCrudExport {...props} />
      </CrudProvider>
    </SmartProvider>,
  );
  act(() => facade.store.set({ loaded: true, filter }));

  const exportSpy = jest.spyOn(facade, 'export');

  return { facade, exportSpy, service, modalService, view };
}

describe('@smartsoft001/crud-shell-react: SmartCrudExport', () => {
  it('should export csv with the filter without offset and limit', async () => {
    const { exportSpy } = setup({ searchText: 'abc', offset: 50, limit: 10 });

    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'CSV' })),
    );

    expect(exportSpy).toHaveBeenCalledWith(
      { searchText: 'abc', offset: undefined, limit: undefined },
      'csv',
    );
  });

  it('should not close while the export is in flight', async () => {
    const dismiss = jest.fn();
    setup({}, { dismiss }, () => new Promise<void>(() => undefined));

    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'CSV' })),
    );

    expect(dismiss).not.toHaveBeenCalled();
  });

  it('should close once the export finished', async () => {
    let finish!: () => void;
    const dismiss = jest.fn();
    setup({}, { dismiss }, () => new Promise<void>((r) => (finish = r)));
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'CSV' })),
    );

    await act(async () => finish());

    expect(dismiss).toHaveBeenCalledTimes(1);
  });

  it('should export xlsx with the xlsx button', async () => {
    const { exportSpy } = setup();

    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'XLSX' })),
    );

    expect(exportSpy).toHaveBeenCalledWith(expect.any(Object), 'xlsx');
  });

  it('should close the last opened modal without a dismiss prop', async () => {
    const { modalService } = setup();
    const dismiss = jest.spyOn(modalService, 'dismiss');

    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'CSV' })),
    );

    expect(dismiss).toHaveBeenCalledTimes(1);
  });

  it('should not close after it was removed', async () => {
    let finish!: () => void;
    const dismiss = jest.fn();
    const { view } = setup(
      {},
      { dismiss },
      () => new Promise<void>((r) => (finish = r)),
    );
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'CSV' })),
    );

    view.unmount();
    await act(async () => finish());

    expect(dismiss).not.toHaveBeenCalled();
  });

  it('should disable the buttons while the feature is loading', () => {
    const { facade } = setup();

    act(() => facade.store.set({ loaded: false }));

    expect(
      screen
        .getAllByRole('button')
        .map((b) => (b as HTMLButtonElement).disabled),
    ).toEqual([true, true]);
  });

  it('should write the application style on its element', () => {
    const { view } = setup();

    expect(
      (
        view.container.querySelector('.smart\\:p-5') as HTMLElement
      ).style.getPropertyValue('--smart-color-primary'),
    ).toBe('#ff0000');
  });

  it('should close at once when the feature is still loaded after the click', () => {
    const dismiss = jest.fn();
    const { exportSpy } = setup({}, { dismiss });
    exportSpy.mockImplementation(() => undefined);

    fireEvent.click(screen.getByRole('button', { name: 'CSV' }));

    expect(dismiss).toHaveBeenCalledTimes(1);
  });
});
