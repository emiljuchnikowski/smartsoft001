import { act, fireEvent, render, screen } from '@testing-library/react';

import { useSmart } from '../../providers/smart-context';
import { SmartContextValue } from '../../providers/smart-context';
import { SmartProvider } from '../../providers/smart-provider';

function setup() {
  let smart!: SmartContextValue;
  const Grab = () => {
    smart = useSmart();
    return null;
  };

  render(
    <SmartProvider language="eng">
      <Grab />
    </SmartProvider>,
  );

  return smart;
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
