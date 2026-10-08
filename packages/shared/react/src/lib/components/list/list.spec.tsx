import { render, screen } from '@testing-library/react';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, Model } from '@smartsoft001/models';

import { SmartList } from './list';
import { SmartListModeProps } from './list.types';
import { LIST_PRESET_MODE_COMPONENTS } from './preset-modes';
import { IListOptions, IListProvider, ListMode } from '../../models';
import { SmartProvider } from '../../providers/smart-provider';
import { AuthService } from '../../services/auth/auth.service';

@Model({})
class TestItemModel implements IEntity<string> {
  id = 'test-id';

  @Field({ list: { order: 2 } })
  lastName = 'Doe';

  @Field({ list: { order: 1 } })
  firstName = 'Jane';

  @Field({ details: true })
  notes = '';
}

function createProvider(
  list: TestItemModel[] = [],
  loading = false,
): IListProvider<TestItemModel> {
  return { list, loading, getData: jest.fn() };
}

const buildOptions = (
  mode?: ListMode,
  provider = createProvider(),
): IListOptions<TestItemModel> => ({
  provider,
  type: TestItemModel,
  mode,
});

const authService = {
  expectPermissions: () => true,
} as unknown as AuthService;

const MockDesktop = (props: SmartListModeProps<TestItemModel>) => (
  <div data-testid="mock-desktop" className={props.className}>
    {props.options.fields?.map((field) => field.key).join(',')}
  </div>
);
const MockMobile = () => <div data-testid="mock-mobile" />;
const MockMasonry = () => <div data-testid="mock-masonry" />;
const MockCustom = () => <div data-testid="mock-custom" />;

const baseMockMap = {
  [ListMode.desktop]: MockDesktop,
  [ListMode.mobile]: MockMobile,
  [ListMode.masonryGrid]: MockMasonry,
};

describe('@smartsoft001/react: SmartList', () => {
  describe('mode dispatch', () => {
    it('should render the desktop table by default', () => {
      render(<SmartList options={buildOptions()} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should render the mobile list for ListMode.mobile', () => {
      render(<SmartList options={buildOptions(ListMode.mobile)} />);

      expect(screen.getByRole('list')).toHaveClass('smart:divide-gray-100');
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('should render the masonry grid for ListMode.masonryGrid', () => {
      render(<SmartList options={buildOptions(ListMode.masonryGrid)} />);

      expect(screen.getByRole('list')).toHaveClass('smart:gap-6');
    });

    it('should render the desktop mock when no mode is set', () => {
      render(
        <SmartProvider listModeComponents={baseMockMap}>
          <SmartList options={buildOptions()} />
        </SmartProvider>,
      );

      expect(screen.getByTestId('mock-desktop')).toBeInTheDocument();
      expect(screen.queryByTestId('mock-mobile')).not.toBeInTheDocument();
    });

    it('should render the component for options.mode when set', () => {
      render(
        <SmartProvider listModeComponents={baseMockMap}>
          <SmartList options={buildOptions(ListMode.masonryGrid)} />
        </SmartProvider>,
      );

      expect(screen.getByTestId('mock-masonry')).toBeInTheDocument();
    });
  });

  describe('with listModeComponents override', () => {
    it('should render the registered custom component for a mode override', () => {
      const listModeComponents = {
        ...baseMockMap,
        [ListMode.desktop]: MockCustom,
      };

      render(
        <SmartProvider listModeComponents={listModeComponents}>
          <SmartList options={buildOptions()} />
        </SmartProvider>,
      );

      expect(screen.getByTestId('mock-custom')).toBeInTheDocument();
      expect(screen.queryByTestId('mock-desktop')).not.toBeInTheDocument();
    });

    it('should keep the default for the modes not overridden', () => {
      const listModeComponents = { [ListMode.desktop]: MockCustom };

      render(
        <SmartProvider listModeComponents={listModeComponents}>
          <SmartList options={buildOptions(ListMode.mobile)} />
        </SmartProvider>,
      );

      expect(screen.getByRole('list')).toHaveClass('smart:divide-gray-100');
    });

    it('should render the presets registered from LIST_PRESET_MODE_COMPONENTS', () => {
      const { container } = render(
        <SmartProvider
          listModeComponents={LIST_PRESET_MODE_COMPONENTS}
          authService={authService}
        >
          <SmartList
            options={buildOptions(
              undefined,
              createProvider([new TestItemModel()]),
            )}
          />
        </SmartProvider>,
      );

      expect(
        container.querySelector('[data-role="table"]'),
      ).toBeInTheDocument();
    });
  });

  describe('with the list component registry key', () => {
    it('should render the component registered as components.list', () => {
      const components = { list: MockCustom };

      render(
        <SmartProvider components={components}>
          <SmartList options={buildOptions(ListMode.mobile)} />
        </SmartProvider>,
      );

      expect(screen.getByTestId('mock-custom')).toBeInTheDocument();
    });
  });

  describe('options and className', () => {
    it('should pass the list fields of the model sorted by order', () => {
      render(
        <SmartProvider listModeComponents={baseMockMap}>
          <SmartList options={buildOptions()} />
        </SmartProvider>,
      );

      expect(screen.getByTestId('mock-desktop')).toHaveTextContent(
        'firstName,lastName',
      );
    });

    it('should pass className to the mode component', () => {
      render(
        <SmartProvider listModeComponents={baseMockMap}>
          <SmartList options={buildOptions()} className="my-class" />
        </SmartProvider>,
      );

      expect(screen.getByTestId('mock-desktop')).toHaveClass('my-class');
    });
  });

  describe('loader and no results', () => {
    it('should show the loader while loading', () => {
      render(
        <SmartProvider listModeComponents={baseMockMap}>
          <SmartList
            options={buildOptions(undefined, createProvider([], true))}
          />
        </SmartProvider>,
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('should show no results for an empty list', () => {
      render(
        <SmartProvider language="eng" listModeComponents={baseMockMap}>
          <SmartList options={buildOptions()} />
        </SmartProvider>,
      );

      const heading = screen.getByRole('heading', { name: 'no results' });
      expect(heading).toHaveClass(
        'smart:mt-4',
        'smart:text-center',
        'smart:text-gray-500',
        'smart:dark:text-gray-400',
      );
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('should not show no results when the list has items', () => {
      render(
        <SmartProvider listModeComponents={baseMockMap}>
          <SmartList
            options={buildOptions(
              undefined,
              createProvider([new TestItemModel()]),
            )}
          />
        </SmartProvider>,
      );

      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });
  });
});
