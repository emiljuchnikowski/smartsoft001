import { act, fireEvent, render, screen } from '@testing-library/react';

import { useSmart } from '../../providers/smart-context';
import { SmartContextValue } from '../../providers/smart-context';
import { SmartProvider } from '../../providers/smart-provider';
import { SmartModalPreset } from '../modal/preset/modal-preset';

const PRESET_COMPONENTS = { modal: SmartModalPreset };

function setup({ preset = false }: { preset?: boolean } = {}) {
  let smart!: SmartContextValue;
  const Grab = () => {
    smart = useSmart();
    return null;
  };

  render(
    <SmartProvider
      language="eng"
      components={preset ? PRESET_COMPONENTS : undefined}
    >
      <Grab />
    </SmartProvider>,
  );

  return smart;
}

const Body = ({ name }: { name?: string }) => <p>Hello {name}</p>;

function escape() {
  act(() => {
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
  });
}

describe('@smartsoft001/react: SmartOverlays', () => {
  afterEach(() => jest.useRealTimers());

  it('should show a toast', () => {
    const smart = setup();

    act(() => {
      smart.toastService.info({ message: 'Saved' });
    });

    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('should remove a toast after its duration', () => {
    jest.useFakeTimers();
    const smart = setup();
    act(() => {
      smart.toastService.info({ message: 'Saved', duration: 1000 });
    });

    act(() => jest.advanceTimersByTime(1000));

    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('should swallow error toasts while the error lock is held', () => {
    const smart = setup();
    smart.toastService.addLockError();

    act(() => {
      smart.toastService.error({ message: 'Failed' });
    });

    expect(screen.queryByText('Failed')).not.toBeInTheDocument();
  });

  it('should resolve an alert with the chosen button', async () => {
    const smart = setup();
    let result: Promise<unknown> = Promise.resolve();

    act(() => {
      result = smart.alertService.show({
        header: 'Delete?',
        buttons: [{ text: 'No', role: 'cancel' }, { text: 'Yes' }],
      });
    });
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

    await expect(result).resolves.toMatchObject({ text: 'Yes' });
  });

  it('should close the alert once a button was chosen', async () => {
    const smart = setup();

    act(() => {
      smart.alertService.show({
        header: 'Delete?',
        buttons: [{ text: 'Yes' }],
      });
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
    });

    expect(screen.queryByText('Delete?')).not.toBeInTheDocument();
  });

  it('should render the component a modal was opened with', async () => {
    const smart = setup();
    const Body = ({ name }: { name: string }) => <p>Hello {name}</p>;

    await act(async () => {
      await smart.modalService.show({
        component: Body,
        props: { name: 'Ada' },
      });
    });

    expect(screen.getByText('Hello Ada')).toBeInTheDocument();
  });

  it('should resolve onDidDismiss with the data the component dismissed with', async () => {
    const smart = setup();
    const Body = ({ dismiss }: { dismiss: (data: unknown) => void }) => (
      <button type="button" onClick={() => dismiss('picked')}>
        Pick
      </button>
    );
    let modal!: Awaited<ReturnType<typeof smart.modalService.show>>;

    await act(async () => {
      modal = await smart.modalService.show({ component: Body });
    });
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Pick' })));

    await expect(modal.onDidDismiss()).resolves.toEqual({ data: 'picked' });
  });

  it('should close the modal opened last through the service dismiss', async () => {
    const smart = setup();
    let first!: Awaited<ReturnType<typeof smart.modalService.show>>;
    let second!: Awaited<ReturnType<typeof smart.modalService.show>>;
    const firstDismissed = jest.fn();

    await act(async () => {
      first = await smart.modalService.show({
        component: Body,
        props: { name: 'first' },
      });
      second = await smart.modalService.show({
        component: Body,
        props: { name: 'second' },
      });
    });
    void first.onDidDismiss().then(firstDismissed);
    await act(async () => {
      await smart.modalService.dismiss('top');
    });

    await expect(second.onDidDismiss()).resolves.toEqual({ data: 'top' });
    expect(firstDismissed).not.toHaveBeenCalled();
    expect(screen.getByText('Hello first')).toBeInTheDocument();
    expect(screen.queryByText('Hello second')).not.toBeInTheDocument();
  });

  it('should resolve with null data when the close button closes the modal', async () => {
    const smart = setup();
    let modal!: Awaited<ReturnType<typeof smart.modalService.show>>;

    await act(async () => {
      modal = await smart.modalService.show({ component: Body });
    });
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Close' })));

    await expect(modal.onDidDismiss()).resolves.toEqual({ data: null });
    expect(screen.queryByText(/Hello/)).not.toBeInTheDocument();
  });

  it('should add the css classes and the bottom class for the bottom mode', async () => {
    const smart = setup();

    await act(async () => {
      await smart.modalService.show({
        component: Body,
        mode: 'bottom',
        cssClass: ['my-modal'],
      });
    });

    const host = document.body.querySelector('[data-role="modal"]');
    expect(host).toHaveAttribute('data-mode', 'bottom');
    expect(host?.querySelector('dialog')).toHaveClass(
      'my-modal',
      'smart-modal-bottom',
    );
  });

  describe('preset modal', () => {
    function backdrop() {
      return document.body.querySelector(
        '[data-role="modal"] [role="presentation"]',
      ) as HTMLElement;
    }

    it('should resolve with null data when the backdrop is clicked', async () => {
      const smart = setup({ preset: true });
      let modal!: Awaited<ReturnType<typeof smart.modalService.show>>;

      await act(async () => {
        modal = await smart.modalService.show({ component: Body });
      });
      act(() => fireEvent.click(backdrop()));

      await expect(modal.onDidDismiss()).resolves.toEqual({ data: null });
    });

    it('should resolve with null data on Escape', async () => {
      const smart = setup({ preset: true });
      let modal!: Awaited<ReturnType<typeof smart.modalService.show>>;

      await act(async () => {
        modal = await smart.modalService.show({ component: Body });
      });
      escape();

      await expect(modal.onDidDismiss()).resolves.toEqual({ data: null });
    });

    it('should stay open on a backdrop click and Escape without backdropDismiss', async () => {
      const smart = setup({ preset: true });
      const dismissed = jest.fn();

      await act(async () => {
        const modal = await smart.modalService.show({
          component: Body,
          props: { name: 'Ada' },
          backdropDismiss: false,
        });
        void modal.onDidDismiss().then(dismissed);
      });
      act(() => fireEvent.click(backdrop()));
      escape();
      await act(async () => undefined);

      expect(dismissed).not.toHaveBeenCalled();
      expect(screen.getByText('Hello Ada')).toBeInTheDocument();
    });

    it('should still close on its close button without backdropDismiss', async () => {
      const smart = setup({ preset: true });
      let modal!: Awaited<ReturnType<typeof smart.modalService.show>>;

      await act(async () => {
        modal = await smart.modalService.show({
          component: Body,
          backdropDismiss: false,
        });
      });
      act(() => fireEvent.click(screen.getByRole('button', { name: 'Close' })));

      await expect(modal.onDidDismiss()).resolves.toEqual({ data: null });
    });
  });

  it('should render no hosts when overlays is null', () => {
    let smart!: SmartContextValue;
    const Grab = () => {
      smart = useSmart();
      return null;
    };
    render(
      <SmartProvider overlays={null}>
        <Grab />
      </SmartProvider>,
    );

    act(() => {
      smart.toastService.info({ message: 'Hidden' });
    });

    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });
});
