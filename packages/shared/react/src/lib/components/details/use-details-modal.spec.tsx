import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import {
  IDetailsModalOptions,
  useDetailsModal,
  UseDetailsModalCallbacks,
} from './use-details-modal';
import { SmartProvider } from '../../providers/smart-provider';
import { ModalService } from '../../services/modal/modal.service';

function Page() {
  return <p>page</p>;
}

function setup(
  options: IDetailsModalOptions | null,
  callbacks: UseDetailsModalCallbacks = {},
) {
  const modalService = new ModalService();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <SmartProvider modalService={modalService} overlays={null}>
      {children}
    </SmartProvider>
  );
  const { result } = renderHook(() => useDetailsModal(options, callbacks), {
    wrapper,
  });

  const open = () => {
    let done!: Promise<void>;

    act(() => {
      done = result.current();
    });

    return done;
  };

  return { modalService, open };
}

describe('@smartsoft001/react: useDetailsModal', () => {
  it('should open the component in a modal with the params as value', () => {
    const params = { type: Object, item: { id: '1' } };
    const { modalService, open } = setup({ component: Page, params });

    void open();

    expect(modalService.modals.get()).toEqual([
      expect.objectContaining({
        component: Page,
        props: { value: params },
      }),
    ]);
  });

  it('should open a bottom modal by default', () => {
    const { modalService, open } = setup({ component: Page, params: {} });

    void open();

    expect(modalService.modals.get()[0].mode).toBe('bottom');
  });

  it('should open the modal in the requested mode', () => {
    const { modalService, open } = setup({
      component: Page,
      params: {},
      mode: 'default',
    });

    void open();

    expect(modalService.modals.get()[0].mode).toBe('default');
  });

  it('should call onShowed once the modal is open', async () => {
    const onShowed = jest.fn();
    const { open } = setup({ component: Page, params: {} }, { onShowed });

    void open();

    await waitFor(() => expect(onShowed).toHaveBeenCalledTimes(1));
  });

  it('should call onDismissed once the modal is dismissed', async () => {
    const onDismissed = jest.fn();
    const { modalService, open } = setup(
      { component: Page, params: {} },
      { onDismissed },
    );
    const done = open();

    await act(async () => {
      await modalService.dismiss();
      await done;
    });

    expect(onDismissed).toHaveBeenCalledTimes(1);
  });

  it('should not call onDismissed while the modal is open', async () => {
    const onShowed = jest.fn();
    const onDismissed = jest.fn();
    const { open } = setup(
      { component: Page, params: {} },
      { onShowed, onDismissed },
    );

    void open();
    await waitFor(() => expect(onShowed).toHaveBeenCalled());

    expect(onDismissed).not.toHaveBeenCalled();
  });

  it('should not open anything without a component', async () => {
    const { modalService, open } = setup({
      component: undefined as never,
      params: {},
    });

    await open();

    expect(modalService.modals.get()).toEqual([]);
  });

  it('should not open anything without options', async () => {
    const { modalService, open } = setup(null);

    await open();

    expect(modalService.modals.get()).toEqual([]);
  });
});
