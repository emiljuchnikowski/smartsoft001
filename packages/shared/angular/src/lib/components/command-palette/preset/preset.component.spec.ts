import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandPalettePresetComponent } from './preset.component';
import {
  ICommand,
  ICommandPaletteOptions,
  SmartCommandPaletteVariant,
} from '../../../models';

describe('@smartsoft001/shared-angular: CommandPalettePresetComponent', () => {
  let fixture: ComponentFixture<CommandPalettePresetComponent>;
  let component: CommandPalettePresetComponent;

  const COMMANDS: ICommand[] = [
    {
      id: 'a',
      label: 'Alpha',
      icon: 'A',
      group: 'Files',
      description: 'First',
    },
    { id: 'b', label: 'Bravo', icon: 'B', group: 'Files', imageUrl: '/b.png' },
    { id: 'c', label: 'Charlie', icon: 'C', group: 'Tools' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandPalettePresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommandPalettePresetComponent);
    component = fixture.componentInstance;
  });

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function byRole(role: string): HTMLElement | null {
    return host().querySelector(`[data-role="${role}"]`);
  }

  function allByRole(role: string): NodeListOf<HTMLElement> {
    return host().querySelectorAll(`[data-role="${role}"]`);
  }

  function open(
    commands: ICommand[] = COMMANDS,
    options?: ICommandPaletteOptions,
    query = '',
  ): void {
    fixture.componentRef.setInput('commands', commands);
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('query', query);
    if (options) {
      fixture.componentRef.setInput('options', options);
    }
    fixture.detectChanges();
  }

  function openVariant(variant: SmartCommandPaletteVariant): void {
    open(COMMANDS, { variant });
  }

  describe('creation and open state', () => {
    it('should create an instance', () => {
      expect(component).toBeInstanceOf(CommandPalettePresetComponent);
    });

    it('should render a dialog with data-role="dialog" when open', () => {
      open();

      expect(byRole('dialog')).toBeTruthy();
    });

    it('should reflect open() in the dialog open attribute', () => {
      open();

      expect(byRole('dialog')?.hasAttribute('open')).toBe(true);
    });

    it('should render the search input with data-role="search"', () => {
      open();

      const search = byRole('search');
      expect(search).toBeTruthy();
      expect(search?.getAttribute('type')).toBe('search');
    });

    it('should render the results list with data-role="list"', () => {
      open();

      const list = byRole('list');
      expect(list).toBeTruthy();
      expect(list?.getAttribute('role')).toBe('listbox');
    });
  });

  describe('filtering', () => {
    it('should render one item per command', () => {
      open();

      expect(allByRole('item')).toHaveLength(3);
    });

    it('should filter items by query (case-insensitive substring)', () => {
      open(COMMANDS, undefined, 'br');

      const items = allByRole('item');
      expect(items).toHaveLength(1);
      expect(items[0].textContent?.trim()).toBe('Bravo');
    });

    it('should render an empty state with data-role="empty" using options.emptyText', () => {
      open(
        [{ id: 'a', label: 'Alpha' }],
        { emptyText: 'Nothing found' },
        'zzz',
      );

      const empty = byRole('empty');
      expect(empty).toBeTruthy();
      expect(empty?.textContent?.trim()).toBe('Nothing found');
    });
  });

  describe('selection', () => {
    it('should emit runCommand and set open=false when an item is clicked', () => {
      open([{ id: 'alpha', label: 'A' }]);
      const spy = jest.fn();
      component.runCommand.subscribe(spy);

      byRole('item')?.click();

      expect(spy).toHaveBeenCalledWith({ commandId: 'alpha' });
      expect(component.open()).toBe(false);
    });

    it('should update query() when the search input event fires', () => {
      open();
      const search = byRole('search') as HTMLInputElement;
      search.value = 'hello';
      search.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.query()).toBe('hello');
    });
  });

  describe('variant classes', () => {
    it('should default to the simple variant with an opaque white dialog', () => {
      open();

      expect(byRole('dialog')?.className).toContain('smart:bg-white');
    });

    it('should apply looser row padding for with-padding', () => {
      openVariant('with-padding');

      expect(byRole('item')?.className).toContain('smart:py-4');
    });

    it('should render an icon slot per item for with-icons', () => {
      openVariant('with-icons');

      expect(allByRole('item-icon').length).toBeGreaterThan(0);
    });

    it('should render an image slot for with-images when imageUrl is present', () => {
      openVariant('with-images');

      const image = byRole('item-image') as HTMLImageElement | null;
      expect(image).toBeTruthy();
      expect(image?.getAttribute('src')).toBe('/b.png');
    });

    it('should apply a translucent blurred dialog for semi-transparent', () => {
      openVariant('semi-transparent');

      const cls = byRole('dialog')?.className ?? '';
      expect(cls).toContain('smart:backdrop-blur');
      expect(cls).toContain('smart:bg-white/90');
    });

    it('should render group headers with data-role="group" for with-groups', () => {
      openVariant('with-groups');

      const groups = allByRole('group');
      expect(groups.length).toBe(2);
      expect(groups[0].textContent?.trim()).toBe('Files');
    });

    it('should render a footer bar with data-role="footer" for with-footer', () => {
      openVariant('with-footer');

      expect(byRole('footer')).toBeTruthy();
    });

    it('should render a preview pane with data-role="preview" for with-preview', () => {
      openVariant('with-preview');

      expect(byRole('preview-layout')).toBeTruthy();
      expect(byRole('preview')).toBeTruthy();
    });

    it('should preview the first command by default and the hovered command on mouseenter', () => {
      openVariant('with-preview');

      const preview = byRole('preview');
      expect(preview?.textContent).toContain('Alpha');

      const items = allByRole('item');
      items[2].dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();

      expect(byRole('preview')?.textContent).toContain('Charlie');
    });
  });

  describe('cssClass override', () => {
    it('should drop the class alias and expose a canonical cssClass input', () => {
      fixture.componentRef.setInput('cssClass', 'my-extra-class');
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      expect(byRole('dialog')?.className).toContain('my-extra-class');
    });
  });
});
