import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';

import { SmartCommandPalette } from './command-palette';
import { SmartCommandPaletteProps } from './command-palette.types';
import { SmartCommandPalettePreset } from './preset/command-palette-preset';
import { SmartCommandPaletteStandard } from './standard/command-palette-standard';
import { useCommandPalette } from './use-command-palette';
import { ICommand, SmartCommandPaletteVariant } from '../../models';
import { SmartProvider } from '../../providers/smart-provider';

const ABC: ICommand[] = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Bravo' },
  { id: 'c', label: 'Charlie' },
];

function dialogOf(container: HTMLElement): HTMLDialogElement {
  return container.querySelector('dialog') as HTMLDialogElement;
}

function closeDialog(container: HTMLElement): void {
  fireEvent(dialogOf(container), new Event('close'));
}

describe('@smartsoft001/react: SmartCommandPalette', () => {
  describe('useCommandPalette', () => {
    it('should default to closed with an empty query', () => {
      const { result } = renderHook(() => useCommandPalette({}));

      expect(result.current.open).toBe(false);
      expect(result.current.query).toBe('');
      expect(result.current.filteredCommands).toEqual([]);
    });

    it('should return every command for an empty query', () => {
      const { result } = renderHook(() => useCommandPalette({ commands: ABC }));

      expect(result.current.filteredCommands).toHaveLength(3);
    });

    it('should filter case-insensitively by label substring', () => {
      const { result } = renderHook(() =>
        useCommandPalette({ commands: ABC, query: 'BR' }),
      );

      expect(result.current.filteredCommands.map((c) => c.id)).toEqual(['b']);
    });

    it('should return no command when nothing matches', () => {
      const { result } = renderHook(() =>
        useCommandPalette({ commands: ABC, query: 'zzz' }),
      );

      expect(result.current.filteredCommands).toEqual([]);
    });

    it('should run the command and close on selectCommand', () => {
      const onRunCommand = jest.fn();
      const onOpenChange = jest.fn();
      const { result } = renderHook(() =>
        useCommandPalette({ defaultOpen: true, onRunCommand, onOpenChange }),
      );

      act(() => result.current.selectCommand('alpha'));

      expect(onRunCommand).toHaveBeenCalledWith({ commandId: 'alpha' });
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(result.current.open).toBe(false);
    });

    it('should close on close()', () => {
      const { result } = renderHook(() =>
        useCommandPalette({ defaultOpen: true }),
      );

      act(() => result.current.close());

      expect(result.current.open).toBe(false);
    });

    it('should not report a change when closing an already closed palette', () => {
      const onOpenChange = jest.fn();
      const { result } = renderHook(() => useCommandPalette({ onOpenChange }));

      act(() => result.current.close());

      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('should keep a controlled open value until the parent changes it', () => {
      const onOpenChange = jest.fn();
      const { result } = renderHook(() =>
        useCommandPalette({ open: true, onOpenChange }),
      );

      act(() => result.current.close());

      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(result.current.open).toBe(true);
    });

    it('should update an uncontrolled query and report it', () => {
      const onQueryChange = jest.fn();
      const { result } = renderHook(() =>
        useCommandPalette({ commands: ABC, onQueryChange }),
      );

      act(() => result.current.setQuery('char'));

      expect(onQueryChange).toHaveBeenCalledWith('char');
      expect(result.current.filteredCommands.map((c) => c.id)).toEqual(['c']);
    });
  });

  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      render(<SmartCommandPalette commands={ABC} open />);

      expect(screen.getAllByRole('option')).toHaveLength(3);
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('should pass className, query and onRunCommand to the standard implementation', () => {
      const onRunCommand = jest.fn();
      const { container } = render(
        <SmartCommandPalette
          className="passed-class"
          commands={ABC}
          open
          query="alp"
          onRunCommand={onRunCommand}
        />,
      );

      fireEvent.click(screen.getByRole('option', { name: 'Alpha' }));

      expect(dialogOf(container)).toHaveClass('passed-class');
      expect(onRunCommand).toHaveBeenCalledWith({ commandId: 'a' });
    });

    it('should render the implementation registered as components.command-palette', () => {
      const Custom = ({
        open,
        onOpenChange,
        onQueryChange,
        onRunCommand,
      }: SmartCommandPaletteProps) => (
        <button
          data-open={String(open)}
          onClick={() => {
            onOpenChange?.(true);
            onQueryChange?.('find');
            onRunCommand?.({ commandId: 'c' });
          }}
        >
          custom
        </button>
      );
      const onOpenChange = jest.fn();
      const onQueryChange = jest.fn();
      const onRunCommand = jest.fn();

      const { container } = render(
        <SmartProvider components={{ 'command-palette': Custom }}>
          <SmartCommandPalette
            open={false}
            onOpenChange={onOpenChange}
            onQueryChange={onQueryChange}
            onRunCommand={onRunCommand}
          />
        </SmartProvider>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'custom' }));

      expect(container.querySelector('dialog')).toBeNull();
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(onQueryChange).toHaveBeenCalledWith('find');
      expect(onRunCommand).toHaveBeenCalledWith({ commandId: 'c' });
    });
  });

  describe('standard', () => {
    it('should render a closed dialog by default', () => {
      const { container } = render(<SmartCommandPaletteStandard />);

      expect(dialogOf(container)).not.toHaveAttribute('open');
    });

    it('should open the dialog with defaultOpen', () => {
      const { container } = render(<SmartCommandPaletteStandard defaultOpen />);

      expect(dialogOf(container)).toHaveAttribute('open');
    });

    it('should reflect a controlled open in the dialog open attribute', () => {
      const { container } = render(<SmartCommandPaletteStandard open />);

      expect(dialogOf(container)).toHaveAttribute('open');
    });

    it('should render a search input and a listbox', () => {
      render(<SmartCommandPaletteStandard open />);

      expect(screen.getByRole('searchbox')).toHaveAttribute('type', 'search');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should render an option per filtered command', () => {
      render(<SmartCommandPaletteStandard open commands={ABC} query="BR" />);

      const options = screen.getAllByRole('option');

      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent('Bravo');
    });

    it('should filter the options while typing (uncontrolled query)', () => {
      const onQueryChange = jest.fn();
      render(
        <SmartCommandPaletteStandard
          open
          commands={ABC}
          onQueryChange={onQueryChange}
        />,
      );

      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'hello' },
      });

      expect(onQueryChange).toHaveBeenCalledWith('hello');
      expect(screen.getByRole('searchbox')).toHaveValue('hello');
      expect(screen.queryAllByRole('option')).toHaveLength(0);
    });

    it('should start from defaultQuery', () => {
      render(
        <SmartCommandPaletteStandard open commands={ABC} defaultQuery="cha" />,
      );

      expect(screen.getByRole('searchbox')).toHaveValue('cha');
      expect(screen.getAllByRole('option')).toHaveLength(1);
    });

    it('should run the command and close when an option is clicked', () => {
      const onRunCommand = jest.fn();
      const onOpenChange = jest.fn();
      const { container } = render(
        <SmartCommandPaletteStandard
          defaultOpen
          commands={[{ id: 'alpha', label: 'A' }]}
          onRunCommand={onRunCommand}
          onOpenChange={onOpenChange}
        />,
      );

      fireEvent.click(screen.getByRole('option', { name: 'A' }));

      expect(onRunCommand).toHaveBeenCalledWith({ commandId: 'alpha' });
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(dialogOf(container)).not.toHaveAttribute('open');
    });

    it('should close when the dialog fires close (Escape / native close)', () => {
      const onOpenChange = jest.fn();
      const { container } = render(
        <SmartCommandPaletteStandard defaultOpen onOpenChange={onOpenChange} />,
      );

      closeDialog(container);

      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(dialogOf(container)).not.toHaveAttribute('open');
    });

    it('should set the placeholder and aria-label from options', () => {
      render(
        <SmartCommandPaletteStandard
          open
          options={{ placeholder: 'Search…', ariaLabel: 'Commands' }}
        />,
      );

      const input = screen.getByRole('searchbox', { name: 'Commands' });

      expect(input).toHaveAttribute('placeholder', 'Search…');
    });

    it('should not set placeholder and aria-label without options', () => {
      render(<SmartCommandPaletteStandard open />);

      expect(screen.getByRole('searchbox')).not.toHaveAttribute('placeholder');
      expect(screen.getByRole('searchbox')).not.toHaveAttribute('aria-label');
    });

    it('should apply className on the dialog', () => {
      const { container } = render(
        <SmartCommandPaletteStandard className="my-extra-class" />,
      );

      expect(dialogOf(container)).toHaveClass('my-extra-class');
    });

    it('should render "No results" when nothing matches', () => {
      const { container } = render(
        <SmartCommandPaletteStandard open commands={ABC} query="zzz" />,
      );

      expect(
        container.querySelector('.smart-command-palette-empty'),
      ).toHaveTextContent('No results');
    });

    it('should render options.emptyText when nothing matches', () => {
      const { container } = render(
        <SmartCommandPaletteStandard
          open
          commands={ABC}
          query="zzz"
          options={{ emptyText: 'Nothing found' }}
        />,
      );

      expect(
        container.querySelector('.smart-command-palette-empty'),
      ).toHaveTextContent('Nothing found');
    });
  });

  describe('preset', () => {
    const COMMANDS: ICommand[] = [
      {
        id: 'a',
        label: 'Alpha',
        icon: 'A',
        group: 'Files',
        description: 'First',
      },
      {
        id: 'b',
        label: 'Bravo',
        icon: 'B',
        group: 'Files',
        imageUrl: '/b.png',
      },
      { id: 'c', label: 'Charlie', icon: 'C', group: 'Tools' },
    ];

    function zone(container: HTMLElement, role: string): HTMLElement | null {
      return container.querySelector(`[data-role="${role}"]`);
    }

    function zoneOrFail(container: HTMLElement, role: string): HTMLElement {
      const element = zone(container, role);
      if (!element) throw new Error(`No [data-role="${role}"] element`);
      return element;
    }

    function zones(container: HTMLElement, role: string): HTMLElement[] {
      return Array.from(container.querySelectorAll(`[data-role="${role}"]`));
    }

    function renderVariant(variant: SmartCommandPaletteVariant) {
      return render(
        <SmartCommandPalettePreset
          open
          commands={COMMANDS}
          options={{ variant }}
        />,
      );
    }

    it('should render an open dialog with data-role="dialog"', () => {
      const { container } = render(<SmartCommandPalettePreset open />);

      expect(zone(container, 'dialog')).toHaveAttribute('open');
    });

    it('should render the search input and the listbox', () => {
      const { container } = render(<SmartCommandPalettePreset open />);

      expect(zone(container, 'search')).toHaveAttribute('type', 'search');
      expect(zone(container, 'list')).toHaveAttribute('role', 'listbox');
      expect(
        zone(container, 'search-wrap')?.querySelector('svg'),
      ).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render one item per command', () => {
      const { container } = render(
        <SmartCommandPalettePreset open commands={COMMANDS} />,
      );

      expect(zones(container, 'item')).toHaveLength(3);
    });

    it('should filter items by query', () => {
      const { container } = render(
        <SmartCommandPalettePreset open commands={COMMANDS} query="br" />,
      );

      const items = zones(container, 'item');

      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent('Bravo');
    });

    it('should render the empty state with options.emptyText', () => {
      const { container } = render(
        <SmartCommandPalettePreset
          open
          commands={COMMANDS}
          query="zzz"
          options={{ emptyText: 'Nothing found' }}
        />,
      );

      expect(zone(container, 'empty')).toHaveTextContent('Nothing found');
    });

    it('should render "No results" as the default empty state', () => {
      const { container } = render(<SmartCommandPalettePreset open />);

      expect(zone(container, 'empty')).toHaveTextContent('No results');
    });

    it('should run the command and close when an item is clicked', () => {
      const onRunCommand = jest.fn();
      const { container } = render(
        <SmartCommandPalettePreset
          defaultOpen
          commands={[{ id: 'alpha', label: 'A' }]}
          onRunCommand={onRunCommand}
        />,
      );

      fireEvent.click(zoneOrFail(container, 'item'));

      expect(onRunCommand).toHaveBeenCalledWith({ commandId: 'alpha' });
      expect(zone(container, 'dialog')).not.toHaveAttribute('open');
    });

    it('should report the typed query', () => {
      const onQueryChange = jest.fn();
      const { container } = render(
        <SmartCommandPalettePreset open onQueryChange={onQueryChange} />,
      );

      fireEvent.change(zoneOrFail(container, 'search'), {
        target: { value: 'hello' },
      });

      expect(onQueryChange).toHaveBeenCalledWith('hello');
    });

    it('should close when the dialog fires close', () => {
      const onOpenChange = jest.fn();
      const { container } = render(
        <SmartCommandPalettePreset open onOpenChange={onOpenChange} />,
      );

      closeDialog(container);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should default to the simple variant with an opaque white dialog', () => {
      const { container } = render(<SmartCommandPalettePreset open />);

      expect(zone(container, 'dialog')).toHaveClass('smart:bg-white');
    });

    it('should apply looser row padding for with-padding', () => {
      const { container } = renderVariant('with-padding');

      expect(zone(container, 'item')).toHaveClass('smart:py-4');
    });

    it('should render an icon slot per item for with-icons', () => {
      const { container } = render(
        <SmartCommandPalettePreset
          open
          commands={[...COMMANDS, { id: 'd', label: 'Delta' }]}
          options={{ variant: 'with-icons' }}
        />,
      );

      expect(zones(container, 'item-icon').map((i) => i.textContent)).toEqual([
        'A',
        'B',
        'C',
        '#',
      ]);
    });

    it('should render an image slot for with-images when imageUrl is present', () => {
      const { container } = renderVariant('with-images');

      const images = zones(container, 'item-image');

      expect(images).toHaveLength(1);
      expect(images[0]).toHaveAttribute('src', '/b.png');
      expect(images[0]).toHaveAttribute('alt', 'Bravo');
    });

    it('should apply a translucent blurred dialog for semi-transparent', () => {
      const { container } = renderVariant('semi-transparent');

      expect(zone(container, 'dialog')).toHaveClass(
        'smart:backdrop-blur',
        'smart:bg-white/90',
      );
    });

    it('should render group headers for with-groups', () => {
      const { container } = render(
        <SmartCommandPalettePreset
          open
          commands={[...COMMANDS, { id: 'd', label: 'Delta' }]}
          options={{ variant: 'with-groups' }}
        />,
      );

      expect(zones(container, 'group').map((g) => g.textContent)).toEqual([
        'Files',
        'Tools',
        'Other',
      ]);
      expect(zones(container, 'item')).toHaveLength(4);
    });

    it('should render the empty state for with-groups without results', () => {
      const { container } = render(
        <SmartCommandPalettePreset
          open
          commands={COMMANDS}
          query="zzz"
          options={{ variant: 'with-groups' }}
        />,
      );

      expect(zone(container, 'empty')).toHaveTextContent('No results');
      expect(zone(container, 'group')).toBeNull();
    });

    it('should render a footer with the result count for with-footer', () => {
      const { container } = renderVariant('with-footer');

      expect(zone(container, 'footer')).toHaveTextContent('3 results');
      expect(zone(container, 'footer')).toHaveTextContent(
        'Enter to run · Esc to close',
      );
    });

    it('should render the result count as one text node', () => {
      const { container } = renderVariant('with-footer');

      const count = zoneOrFail(container, 'footer').firstElementChild;

      expect(count?.childNodes).toHaveLength(1);
      expect(count?.textContent).toBe('3 results');
    });

    it('should not render the footer for other variants', () => {
      const { container } = renderVariant('simple');

      expect(zone(container, 'footer')).toBeNull();
    });

    it('should render a preview pane for with-preview', () => {
      const { container } = renderVariant('with-preview');

      expect(zone(container, 'preview-layout')).toBeInTheDocument();
      expect(zone(container, 'preview')).toBeInTheDocument();
      expect(zone(container, 'dialog')).toHaveClass('smart:max-w-3xl');
    });

    it('should preview the first command by default and the hovered one on mouseenter', () => {
      const { container } = renderVariant('with-preview');

      expect(zone(container, 'preview')).toHaveTextContent('AlphaFirst');

      fireEvent.mouseEnter(zones(container, 'item')[2]);

      expect(zone(container, 'preview')).toHaveTextContent('Charlie');
      expect(zone(container, 'preview')).not.toHaveTextContent('Alpha');
    });

    it('should merge className onto the dialog', () => {
      const { container } = render(
        <SmartCommandPalettePreset open className="my-extra-class" />,
      );

      expect(zone(container, 'dialog')).toHaveClass('my-extra-class');
    });
  });
});
