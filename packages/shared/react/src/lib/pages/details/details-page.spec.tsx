import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';
import type { ReactNode } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, Model } from '@smartsoft001/models';

import { SmartDetailsPage } from './details-page';
import { useDetailsPageOptions } from './use-details-page-options';
import { useDetailsModal } from '../../components/details/use-details-modal';
import { IDetailsOptions } from '../../models';
import { SmartProvider } from '../../providers/smart-provider';
import { ModalService } from '../../services/modal/modal.service';
import { StyleService } from '../../services/style/style.service';

@Model({})
class Customer implements IEntity<string> {
  id = 'customer-1';

  @Field({ details: true })
  name = 'Ada';
}

function detailsOptions(
  partial: Partial<IDetailsOptions<Customer>> = {},
): IDetailsOptions<Customer> {
  return { type: Customer, item: new Customer(), ...partial };
}

function OpenButton({ params }: { params: IDetailsOptions<Customer> }) {
  const open = useDetailsModal({ component: SmartDetailsPage, params });

  return (
    <button type="button" onClick={() => void open()}>
      open
    </button>
  );
}

describe('@smartsoft001/react: SmartDetailsPage', () => {
  it('should render the details of the value', () => {
    render(
      <SmartProvider translations={{ MODEL: { name: 'Name' } }}>
        <SmartDetailsPage value={detailsOptions()} />
      </SmartProvider>,
    );

    expect([
      screen.getByText('Name').tagName,
      screen.getByText('Ada').tagName,
    ]).toEqual(['SPAN', 'P']);
  });

  it('should take the full width', () => {
    const { container } = render(<SmartDetailsPage value={detailsOptions()} />);

    expect(container.firstElementChild).toHaveClass('smart:w-full');
  });

  it('should apply the application style to its element', () => {
    const init = jest.spyOn(StyleService.prototype, 'init');

    const { container } = render(<SmartDetailsPage value={detailsOptions()} />);

    expect(init).toHaveBeenCalledWith(container.firstElementChild);
    init.mockRestore();
  });

  it('should render empty details without a value', () => {
    const { container } = render(<SmartDetailsPage />);

    expect(container.querySelector('dl')).toBeEmptyDOMElement();
  });

  it('should show the details in the modal opened by useDetailsModal', () => {
    render(
      <SmartProvider>
        <OpenButton params={detailsOptions()} />
      </SmartProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'open' }));

    expect(screen.getByText('Ada')).toBeInTheDocument();
  });
});

describe('@smartsoft001/react: useDetailsPageOptions', () => {
  function setup(value?: IDetailsOptions<Customer>) {
    const modalService = new ModalService();
    const dismiss = jest.spyOn(modalService, 'dismiss');
    const wrapper = ({ children }: { children: ReactNode }) => (
      <SmartProvider modalService={modalService} overlays={null}>
        {children}
      </SmartProvider>
    );
    const { result } = renderHook(() => useDetailsPageOptions(value), {
      wrapper,
    });

    return { result, dismiss };
  }

  it('should default to the details title without the menu button', () => {
    const { result } = setup(detailsOptions());

    expect(result.current).toEqual({
      title: 'details',
      hideMenuButton: true,
      endButtons: [],
    });
  });

  it('should take the title of the value', () => {
    const { result } = setup(detailsOptions({ title: 'Customer' }));

    expect(result.current.title).toBe('Customer');
  });

  it('should add a trash button with a remove handler', () => {
    const { result } = setup(detailsOptions({ removeHandler: jest.fn() }));

    expect(result.current.endButtons?.map((b) => b.icon)).toEqual(['trash']);
  });

  it('should remove the item and close the modal on the trash button', () => {
    const removeHandler = jest.fn();
    const item = new Customer();
    const { result, dismiss } = setup(detailsOptions({ item, removeHandler }));

    act(() => result.current.endButtons?.[0].handler?.());

    expect([removeHandler.mock.calls, dismiss.mock.calls.length]).toEqual([
      [[item]],
      1,
    ]);
  });

  it('should add an open button with an item handler', () => {
    const { result } = setup(detailsOptions({ itemHandler: jest.fn() }));

    expect(result.current.endButtons?.map((b) => b.icon)).toEqual([
      'arrow-forward-outline',
    ]);
  });

  it('should open the item and close the modal on the open button', () => {
    const itemHandler = jest.fn();
    const { result, dismiss } = setup(detailsOptions({ itemHandler }));

    act(() => result.current.endButtons?.[0].handler?.());

    expect([itemHandler.mock.calls, dismiss.mock.calls.length]).toEqual([
      [['customer-1']],
      1,
    ]);
  });
});
