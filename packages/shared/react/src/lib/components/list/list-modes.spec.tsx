import { act, fireEvent, render, screen, within } from '@testing-library/react';
import type { ComponentType } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartListDesktop } from './desktop/list-desktop';
import { SmartListDesktopPreset } from './desktop/preset/list-desktop-preset';
import { SmartListDetailsModal } from './list-details-modal';
import { SmartListModeProps } from './list.types';
import { SmartListMasonryGrid } from './masonry-grid/list-masonry-grid';
import { SmartListMasonryGridPreset } from './masonry-grid/preset/list-masonry-grid-preset';
import { SmartListMobile } from './mobile/list-mobile';
import {
  IDetailsProvider,
  IListInternalOptions,
  IListProvider,
} from '../../models';
import { SmartListMobilePreset } from './mobile/preset/list-mobile-preset';
import { SmartDetailsPage } from '../../pages/details/details-page';
import { SmartProvider } from '../../providers/smart-provider';
import { AuthService } from '../../services/auth/auth.service';
import { ModalService } from '../../services/modal/modal.service';

@Model({})
class Member implements IEntity<string> {
  id = '';

  @Field({ type: FieldType.text, list: { order: 1 }, details: true })
  firstName = '';

  @Field({ type: FieldType.text, list: { order: 2 } })
  lastName = '';
}

type Mode = ComponentType<SmartListModeProps<Member>>;

const MODES: Array<[string, Mode]> = [
  ['desktop', SmartListDesktop],
  ['desktop preset', SmartListDesktopPreset],
  ['mobile', SmartListMobile],
  ['mobile preset', SmartListMobilePreset],
  ['masonry grid', SmartListMasonryGrid],
  ['masonry grid preset', SmartListMasonryGridPreset],
];

const DESKTOP_MODES = MODES.slice(0, 2);

const MEMBERS: Member[] = [
  { id: '1', firstName: 'Lindsay', lastName: 'Walton' },
  { id: '2', firstName: 'Courtney', lastName: 'Henry' },
];

const authService = {
  expectPermissions: () => true,
} as unknown as AuthService;

const TRANSLATIONS = {
  MODEL: { firstName: 'first name', lastName: 'last name' },
};

function createProvider(): IListProvider<Member> {
  return { list: MEMBERS, loading: false, getData: jest.fn() };
}

function createDetailsProvider(
  item: Member | null = null,
): IDetailsProvider<Member> {
  return { getData: jest.fn(), clearData: jest.fn(), item, loading: false };
}

function setup(
  ModeComponent: Mode,
  options: Partial<IListInternalOptions<Member>> = {},
) {
  const modalService = new ModalService();
  const provider = createProvider();
  const build = (
    extra: Partial<IListInternalOptions<Member>>,
  ): IListInternalOptions<Member> => ({
    provider,
    type: Member,
    fields: [
      { key: 'firstName', options: { list: { order: 1 } } },
      { key: 'lastName', options: { list: { order: 2 } } },
    ],
    ...extra,
  });
  const ui = (extra: Partial<IListInternalOptions<Member>>) => (
    <SmartProvider
      language="eng"
      translations={TRANSLATIONS}
      authService={authService}
      modalService={modalService}
    >
      <ModeComponent options={build(extra)} />
    </SmartProvider>
  );
  const result = render(ui(options));

  return {
    ...result,
    provider,
    modalService,
    rerenderWith: (extra: Partial<IListInternalOptions<Member>>) =>
      result.rerender(ui(extra)),
  };
}

describe('@smartsoft001/react: SmartList modes', () => {
  describe('details', () => {
    it.each(MODES)(
      '%s: should render no details action without details',
      (_name, ModeComponent) => {
        setup(ModeComponent);

        expect(
          screen.queryByRole('button', { name: 'show' }),
        ).not.toBeInTheDocument();
      },
    );

    it.each(MODES)(
      '%s: should render a details action per item',
      (_name, ModeComponent) => {
        setup(ModeComponent, {
          details: { provider: createDetailsProvider() },
        });

        expect(screen.getAllByRole('button', { name: 'show' })).toHaveLength(2);
      },
    );

    it.each(MODES)(
      '%s: should open the details page of the item in a bottom modal',
      async (_name, ModeComponent) => {
        const details = createDetailsProvider();
        const { modalService } = setup(ModeComponent, {
          details: { provider: details },
        });
        const show = jest.spyOn(modalService, 'show');

        await act(async () => {
          fireEvent.click(screen.getAllByRole('button', { name: 'show' })[1]);
        });

        expect(details.clearData).toHaveBeenCalledTimes(1);
        expect(show).toHaveBeenCalledWith({
          component: SmartListDetailsModal,
          props: { component: SmartDetailsPage, store: expect.anything() },
          mode: 'bottom',
        });
        expect(details.getData).toHaveBeenCalledWith('2');
      },
    );

    it('should open the custom details component', async () => {
      const Custom = () => <p>custom details</p>;
      const { modalService } = setup(SmartListDesktop, {
        details: { provider: createDetailsProvider(), component: Custom },
      });
      const show = jest.spyOn(modalService, 'show');

      await act(async () => {
        fireEvent.click(screen.getAllByRole('button', { name: 'show' })[0]);
      });

      expect(show.mock.calls[0][0].props?.['component']).toBe(Custom);
      expect(await screen.findByText('custom details')).toBeInTheDocument();
    });

    it('should show the item the provider loads after the modal opened', async () => {
      const { rerenderWith } = setup(SmartListDesktop, {
        details: { provider: createDetailsProvider() },
      });

      await act(async () => {
        fireEvent.click(screen.getAllByRole('button', { name: 'show' })[1]);
      });
      rerenderWith({
        details: { provider: createDetailsProvider(MEMBERS[1]) },
      });
      await act(async () => undefined);

      const modal = document.body.querySelector(
        '[data-role="modal"]',
      ) as HTMLElement;
      expect(within(modal).getByText('Courtney')).toBeInTheDocument();
    });
  });

  describe('sort', () => {
    function header(name: string): HTMLElement {
      return screen.getByRole('button', { name }).closest('th') as HTMLElement;
    }

    it.each(DESKTOP_MODES)(
      '%s: should render plain headers without sort',
      (_name, ModeComponent) => {
        const { container } = setup(ModeComponent);

        expect(container.querySelector('[data-role="sort"]')).toBeNull();
        expect(container.querySelector('th[aria-sort]')).toBeNull();
      },
    );

    it.each(DESKTOP_MODES)(
      '%s: should render a sort button per field column',
      (_name, ModeComponent) => {
        setup(ModeComponent, { sort: true });

        expect(
          screen.getByRole('button', { name: 'first name' }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'last name' }),
        ).toBeInTheDocument();
      },
    );

    it.each(DESKTOP_MODES)(
      '%s: should show the default sort on its header',
      (_name, ModeComponent) => {
        setup(ModeComponent, {
          sort: { default: 'lastName', defaultDesc: true },
        });

        expect(header('last name')).toHaveAttribute('aria-sort', 'descending');
        expect(header('first name')).not.toHaveAttribute('aria-sort');
      },
    );

    it.each(DESKTOP_MODES)(
      '%s: should read the data sorted by a clicked column from the first page',
      (_name, ModeComponent) => {
        const { provider } = setup(ModeComponent, { sort: true });

        fireEvent.click(screen.getByRole('button', { name: 'first name' }));

        expect(provider.getData).toHaveBeenCalledWith({
          offset: 0,
          sortBy: 'firstName',
          sortDesc: false,
        });
        expect(header('first name')).toHaveAttribute('aria-sort', 'ascending');
      },
    );

    it.each(DESKTOP_MODES)(
      '%s: should toggle the direction of the active column',
      (_name, ModeComponent) => {
        const { provider } = setup(ModeComponent, {
          sort: { default: 'firstName' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'first name' }));

        expect(provider.getData).toHaveBeenCalledWith({
          offset: 0,
          sortBy: 'firstName',
          sortDesc: true,
        });
        expect(header('first name')).toHaveAttribute('aria-sort', 'descending');
      },
    );

    it('should keep the clicked sort when other options change', () => {
      const sort = { default: 'firstName' };
      const { rerenderWith } = setup(SmartListDesktop, { sort });

      fireEvent.click(screen.getByRole('button', { name: 'last name' }));
      rerenderWith({ sort, select: 'multi' });

      expect(header('last name')).toHaveAttribute('aria-sort', 'ascending');
    });

    it('should start over from the default when the sort option changes', () => {
      const { rerenderWith } = setup(SmartListDesktop, {
        sort: { default: 'firstName' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'last name' }));
      rerenderWith({ sort: { default: 'firstName', defaultDesc: true } });

      expect(header('first name')).toHaveAttribute('aria-sort', 'descending');
      expect(header('last name')).not.toHaveAttribute('aria-sort');
    });
  });
});
