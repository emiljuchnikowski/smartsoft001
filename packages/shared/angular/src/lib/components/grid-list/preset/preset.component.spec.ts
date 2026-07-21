import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  getGridListColumnsClasses,
  getGridListGapClasses,
  getGridListGridClasses,
  getGridListTileClasses,
} from './preset-classes.util';
import { GridListPresetComponent } from './preset.component';
import { IGridListOptions } from '../../../models';

@Component({
  template: `
    <ng-template #icon><svg data-testid="the-icon"></svg></ng-template>
    <ng-template #badge><span data-testid="the-badge">NEW</span></ng-template>
    <ng-template #action
      ><button data-testid="the-action">Open</button></ng-template
    >
    <ng-template #empty
      ><p data-testid="the-empty">Nothing here</p></ng-template
    >
    <ng-template #footer
      ><a data-testid="the-footer" href="#">More</a></ng-template
    >
    <smart-grid-list-preset [options]="options" />
  `,
  imports: [GridListPresetComponent],
})
class HostComponent {
  @ViewChild('icon', { static: true }) iconTpl!: TemplateRef<unknown>;
  @ViewChild('badge', { static: true }) badgeTpl!: TemplateRef<unknown>;
  @ViewChild('action', { static: true }) actionTpl!: TemplateRef<unknown>;
  @ViewChild('empty', { static: true }) emptyTpl!: TemplateRef<unknown>;
  @ViewChild('footer', { static: true }) footerTpl!: TemplateRef<unknown>;

  options: IGridListOptions = {};
}

describe('@smartsoft001/shared-angular: GridListPresetComponent', () => {
  describe('preset-classes.util', () => {
    describe('getGridListColumnsClasses', () => {
      it('should return no responsive class for a single column', () => {
        expect(getGridListColumnsClasses(1)).toBe('');
      });

      it('should return undefined columns as no responsive class', () => {
        expect(getGridListColumnsClasses(undefined)).toBe('');
      });

      it('should map 2 columns', () => {
        expect(getGridListColumnsClasses(2)).toBe('smart:sm:grid-cols-2');
      });

      it('should map 3 columns', () => {
        expect(getGridListColumnsClasses(3)).toBe(
          'smart:sm:grid-cols-2 smart:lg:grid-cols-3',
        );
      });

      it('should map 4 columns', () => {
        expect(getGridListColumnsClasses(4)).toBe(
          'smart:sm:grid-cols-2 smart:lg:grid-cols-4',
        );
      });

      it('should map 5 columns', () => {
        expect(getGridListColumnsClasses(5)).toBe(
          'smart:sm:grid-cols-2 smart:lg:grid-cols-5',
        );
      });

      it('should map 6 columns', () => {
        expect(getGridListColumnsClasses(6)).toBe(
          'smart:sm:grid-cols-2 smart:lg:grid-cols-6',
        );
      });
    });

    describe('getGridListGapClasses', () => {
      it('should map sm gap', () => {
        expect(getGridListGapClasses('sm')).toBe('smart:gap-3');
      });

      it('should map md gap', () => {
        expect(getGridListGapClasses('md')).toBe('smart:gap-4');
      });

      it('should map lg gap', () => {
        expect(getGridListGapClasses('lg')).toBe('smart:gap-6');
      });

      it('should default undefined gap to md', () => {
        expect(getGridListGapClasses(undefined)).toBe('smart:gap-4');
      });
    });

    describe('getGridListGridClasses', () => {
      it('should combine base grid, columns and gap', () => {
        expect(getGridListGridClasses({ columns: 3, gap: 'lg' })).toBe(
          'smart:grid smart:grid-cols-1 smart:sm:grid-cols-2 smart:lg:grid-cols-3 smart:gap-6',
        );
      });

      it('should keep only base grid and default gap for undefined options', () => {
        expect(getGridListGridClasses(undefined)).toBe(
          'smart:grid smart:grid-cols-1 smart:gap-4',
        );
      });
    });

    describe('getGridListTileClasses', () => {
      it('should stack cards layout as a column', () => {
        const classes = getGridListTileClasses('cards');

        expect(classes).toContain('smart:rounded-xl');
        expect(classes).toContain('smart:flex smart:flex-col');
      });

      it('should lay horizontal layout as a row', () => {
        const classes = getGridListTileClasses('horizontal');

        expect(classes).toContain('smart:flex smart:items-center');
        expect(classes).not.toContain('smart:flex-col');
      });

      it('should center logos layout', () => {
        const classes = getGridListTileClasses('logos');

        expect(classes).toContain('smart:flex-col');
        expect(classes).toContain('smart:items-center');
        expect(classes).toContain('smart:text-center');
      });

      it('should default undefined layout to cards', () => {
        expect(getGridListTileClasses(undefined)).toBe(
          getGridListTileClasses('cards'),
        );
      });
    });
  });

  describe('component (direct)', () => {
    let fixture: ComponentFixture<GridListPresetComponent>;
    let component: GridListPresetComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [GridListPresetComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(GridListPresetComponent);
      component = fixture.componentInstance;
    });

    function setOptions(options: IGridListOptions): void {
      fixture.componentRef.setInput('options', options);
      fixture.detectChanges();
    }

    function query(role: string): HTMLElement | null {
      return (fixture.nativeElement as HTMLElement).querySelector(
        `[data-role="${role}"]`,
      );
    }

    function queryAll(role: string): HTMLElement[] {
      return Array.from(
        (fixture.nativeElement as HTMLElement).querySelectorAll(
          `[data-role="${role}"]`,
        ),
      );
    }

    it('should create an instance', () => {
      fixture.detectChanges();

      expect(component).toBeInstanceOf(GridListPresetComponent);
    });

    it('should render the header title and description above the grid', () => {
      setOptions({ title: 'Team', description: 'Our people' });

      const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
      expect(text).toContain('Team');
      expect(text).toContain('Our people');
    });

    it('should render the grid with responsive column classes', () => {
      setOptions({ columns: 4, items: [{ title: 'A' }] });

      const grid = query('grid');
      expect(grid?.className).toContain('smart:grid');
      expect(grid?.className).toContain('smart:lg:grid-cols-4');
    });

    it('should render one tile per item', () => {
      setOptions({ items: [{ title: 'A' }, { title: 'B' }, { title: 'C' }] });

      expect(queryAll('item').length).toBe(3);
    });

    it('should render the item title and description', () => {
      setOptions({
        items: [{ title: 'Lindsay', description: 'Front-end developer' }],
      });

      expect(query('title')?.textContent?.trim()).toBe('Lindsay');
      expect(query('description')?.textContent?.trim()).toBe(
        'Front-end developer',
      );
    });

    it('should render the title as a link when href is set', () => {
      setOptions({ items: [{ title: 'Acme', href: '/acme' }] });

      const title = query('title');
      expect(title?.tagName.toLowerCase()).toBe('a');
      expect(title?.getAttribute('href')).toBe('/acme');
      expect(title?.className).toContain('smart:hover:text-blue-600');
    });

    it('should render an image item as media', () => {
      setOptions({
        items: [{ title: 'Acme', imageUrl: '/logo.svg', imageAlt: 'Acme' }],
      });

      const media = query('media');
      const img = media?.querySelector('img') ?? media;
      expect((img as HTMLImageElement)?.getAttribute('src')).toBe('/logo.svg');
      expect((img as HTMLImageElement)?.getAttribute('alt')).toBe('Acme');
    });

    it('should apply the horizontal layout arrangement on the tile', () => {
      setOptions({ layout: 'horizontal', items: [{ title: 'A' }] });

      expect(query('item')?.className).toContain('smart:items-center');
      expect(query('item')?.className).not.toContain('smart:flex-col');
    });

    it('should render a centered default empty state when there are no items', () => {
      setOptions({ items: [] });

      const empty = query('empty');
      expect(empty).not.toBeNull();
      expect(empty?.className).toContain('smart:text-center');
    });

    it('should apply cssClass on the root (canonical name for NgComponentOutlet)', () => {
      fixture.componentRef.setInput('cssClass', 'my-extra-class');
      fixture.detectChanges();

      const root = (fixture.nativeElement as HTMLElement).querySelector('div');
      expect(root?.className).toContain('my-extra-class');
    });
  });

  describe('component (template slots)', () => {
    let fixture: ComponentFixture<HostComponent>;
    let host: HostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [HostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(HostComponent);
      host = fixture.componentInstance;
    });

    function query(role: string): HTMLElement | null {
      return (fixture.nativeElement as HTMLElement).querySelector(
        `[data-role="${role}"]`,
      );
    }

    it('should render the icon template as media (precedence over image)', () => {
      host.options = {
        items: [{ title: 'A', imageUrl: '/logo.svg', iconTpl: host.iconTpl }],
      };
      fixture.detectChanges();

      const media = query('media');
      expect(media?.querySelector('[data-testid="the-icon"]')).not.toBeNull();
      expect(media?.querySelector('img')).toBeNull();
    });

    it('should render the badge template beside the title', () => {
      host.options = {
        items: [{ title: 'A', badgeTpl: host.badgeTpl }],
      };
      fixture.detectChanges();

      expect(
        query('badge')?.querySelector('[data-testid="the-badge"]'),
      ).not.toBeNull();
    });

    it('should render the action template in the tile footer', () => {
      host.options = {
        items: [{ title: 'A', actionTpl: host.actionTpl }],
      };
      fixture.detectChanges();

      expect(
        query('action')?.querySelector('[data-testid="the-action"]'),
      ).not.toBeNull();
    });

    it('should render the custom empty template when provided', () => {
      host.options = { items: [], emptyTpl: host.emptyTpl };
      fixture.detectChanges();

      expect(
        query('empty')?.querySelector('[data-testid="the-empty"]'),
      ).not.toBeNull();
    });

    it('should render the footer template below the grid', () => {
      host.options = {
        items: [{ title: 'A' }],
        footerTpl: host.footerTpl,
      };
      fixture.detectChanges();

      expect(
        query('footer')?.querySelector('[data-testid="the-footer"]'),
      ).not.toBeNull();
    });
  });
});
