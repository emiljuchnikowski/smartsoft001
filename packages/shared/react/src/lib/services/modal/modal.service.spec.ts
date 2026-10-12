import { ModalService } from './modal.service';

describe('@smartsoft001/react: ModalService', () => {
  const Body = () => null;

  function escape(): KeyboardEvent {
    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });
    document.dispatchEvent(event);

    return event;
  }

  it('should keep the requests in opening order', async () => {
    const service = new ModalService();

    await service.show({ component: Body, props: { name: 'first' } });
    await service.show({ component: Body, mode: 'bottom' });

    expect(
      service.modals.get().map(({ props, mode }) => ({ props, mode })),
    ).toEqual([
      { props: { name: 'first' }, mode: undefined },
      { props: undefined, mode: 'bottom' },
    ]);
  });

  it('should resolve onDidDismiss with the data the modal was dismissed with', async () => {
    const service = new ModalService();
    const modal = await service.show({ component: Body });

    modal.dismiss('picked');

    await expect(modal.onDidDismiss()).resolves.toEqual({ data: 'picked' });
    expect(service.modals.get()).toEqual([]);
  });

  it('should close the modal opened last', async () => {
    const service = new ModalService();
    const first = await service.show({ component: Body });
    const second = await service.show({ component: Body });

    await service.dismiss('top');

    await expect(second.onDidDismiss()).resolves.toEqual({ data: 'top' });
    expect(service.modals.get().map((m) => m.dismiss)).toEqual([first.dismiss]);
  });

  it('should stop Escape at the document while the top modal has backdropDismiss false', async () => {
    const service = new ModalService();
    const listener = jest.fn();
    await service.show({ component: Body, backdropDismiss: false });
    document.addEventListener('keydown', listener);

    escape();
    await service.dismiss();
    escape();
    document.removeEventListener('keydown', listener);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should let Escape through for a modal closed by the backdrop', async () => {
    const service = new ModalService();
    const listener = jest.fn();
    await service.show({ component: Body });
    document.addEventListener('keydown', listener);

    escape();
    document.removeEventListener('keydown', listener);
    await service.dismiss();

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
