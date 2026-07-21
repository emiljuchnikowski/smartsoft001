import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  getMultiColumnLayoutContentContainerClasses,
  getMultiColumnLayoutSecondaryClasses,
} from './preset-classes.util';
import { MultiColumnLayoutPresetComponent } from './preset.component';
import { IMultiColumnLayoutOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <ng-template #navTpl><a class="nav-link">Inbox</a></ng-template>
    <ng-template #secondaryTpl><p class="filters">Filters</p></ng-template>
    <ng-template #headerTpl
      ><div class="header-content">Header content</div></ng-template
    >
    <smart-multi-column-layout-preset [options]="options" [cssClass]="cssClass">
      <p class="projected">Main content</p>
    </smart-multi-column-layout-preset>
  `,
  imports: [MultiColumnLayoutPresetComponent],
})
class TestHostComponent {
  @ViewChild('navTpl', { static: true }) navTplRef!: TemplateRef<unknown>;
  @ViewChild('secondaryTpl', { static: true })
  secondaryTplRef!: TemplateRef<unknown>;
  @ViewChild('headerTpl', { static: true }) headerTplRef!: TemplateRef<unknown>;

  options: IMultiColumnLayoutOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: MultiColumnLayoutPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let preset: MultiColumnLayoutPresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    preset = fixture.debugElement.children[0].componentInstance;
  });

  function query(role: string): HTMLElement | null {
    return (fixture.nativeElement as HTMLElement).querySelector(
      `[data-role="${role}"]`,
    );
  }

  async function apply(): Promise<void> {
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  describe('creation', () => {
    it('should create an instance', () => {
      expect(preset).toBeInstanceOf(MultiColumnLayoutPresetComponent);
    });
  });

  describe('root zone', () => {
    it('should render the page root with gray surface classes', () => {
      const root = query('root');

      expect(root).toBeTruthy();
      expect(root?.className).toContain('smart:min-h-full');
      expect(root?.className).toContain('smart:bg-gray-50');
      expect(root?.className).toContain('smart:dark:bg-gray-900');
    });

    it('should merge cssClass onto the root zone (canonical name)', async () => {
      fixture.componentInstance.cssClass = 'my-extra-class';
      await apply();

      expect(query('root')?.className).toContain('my-extra-class');
      expect(query('root')?.className).toContain('smart:min-h-full');
    });
  });

  describe('header zone', () => {
    it('should not render the header zone when neither headerTpl nor title is set', () => {
      expect(query('header')).toBeNull();
    });

    it('should render headerTpl when provided', async () => {
      fixture.componentInstance.options = {
        headerTpl: fixture.componentInstance.headerTplRef,
      };
      await apply();

      const header = query('header');

      expect(header).toBeTruthy();
      expect(header?.tagName).toBe('HEADER');
      expect(header?.textContent).toContain('Header content');
    });

    it('should render the title as fallback when headerTpl is absent', async () => {
      fixture.componentInstance.options = { title: 'Inbox' };
      await apply();

      const title = query('title');

      expect(title).toBeTruthy();
      expect(title?.tagName).toBe('H1');
      expect(title?.textContent?.trim()).toBe('Inbox');
    });

    it('should prefer headerTpl over the title fallback', async () => {
      fixture.componentInstance.options = {
        title: 'Inbox',
        headerTpl: fixture.componentInstance.headerTplRef,
      };
      await apply();

      expect(query('title')).toBeNull();
      expect(query('header')?.textContent).toContain('Header content');
    });

    it('should style the header zone like the stacked-layout preset header', async () => {
      fixture.componentInstance.options = { title: 'Inbox' };
      await apply();

      const header = query('header');

      expect(header?.className).toContain('smart:bg-white');
      expect(header?.className).toContain('smart:dark:bg-gray-800');
      expect(header?.className).toContain('smart:border-b');
    });
  });

  describe('nav zone', () => {
    it('should not render the nav zone when navTpl is absent', () => {
      expect(query('nav')).toBeNull();
    });

    it('should render options.navTpl inside the nav zone', async () => {
      fixture.componentInstance.options = {
        navTpl: fixture.componentInstance.navTplRef,
      };
      await apply();

      const nav = query('nav');

      expect(nav).toBeTruthy();
      expect(nav?.tagName).toBe('ASIDE');
      expect(nav?.querySelector('a.nav-link')).toBeTruthy();
    });

    it('should style the nav aside like the sidebar-layout preset nav', async () => {
      fixture.componentInstance.options = {
        navTpl: fixture.componentInstance.navTplRef,
      };
      await apply();

      const nav = query('nav');

      expect(nav?.className).toContain('smart:w-64');
      expect(nav?.className).toContain('smart:shrink-0');
      expect(nav?.className).toContain('smart:border-e');
      expect(nav?.className).toContain('smart:bg-white');
      expect(nav?.className).toContain('smart:dark:bg-gray-800');
    });
  });

  describe('content zone', () => {
    it('should project ng-content into the content zone', () => {
      const projected = query('content')?.querySelector('p.projected');

      expect(projected).toBeTruthy();
      expect(projected?.textContent).toContain('Main content');
    });

    it('should render the content zone with gray page surface classes', () => {
      const content = query('content');

      expect(content).toBeTruthy();
      expect(content?.tagName).toBe('MAIN');
      expect(content?.className).toContain('smart:bg-gray-50');
      expect(content?.className).toContain('smart:dark:bg-gray-900');
      expect(content?.className).toContain('smart:py-8');
    });

    it('should use a full-width inner container by default', () => {
      const container = query('content')?.firstElementChild;

      expect(container?.className).toContain('smart:px-4');
      expect(container?.className).toContain('smart:max-w-none');
      expect(container?.className).not.toContain('smart:max-w-7xl');
    });

    it('should use a constrained inner container when width is constrained', async () => {
      fixture.componentInstance.options = { width: 'constrained' };
      await apply();

      const container = query('content')?.firstElementChild;

      expect(container?.className).toContain('smart:mx-auto');
      expect(container?.className).toContain('smart:max-w-7xl');
      expect(container?.className).toContain('smart:px-4');
    });
  });

  describe('secondary zone', () => {
    it('should not render the secondary zone when secondaryTpl is absent', () => {
      expect(query('secondary')).toBeNull();
    });

    it('should render options.secondaryTpl inside the secondary zone', async () => {
      fixture.componentInstance.options = {
        secondaryTpl: fixture.componentInstance.secondaryTplRef,
      };
      await apply();

      const secondary = query('secondary');

      expect(secondary).toBeTruthy();
      expect(secondary?.tagName).toBe('ASIDE');
      expect(secondary?.querySelector('p.filters')).toBeTruthy();
    });

    it('should style the secondary aside with a start border and white surface', async () => {
      fixture.componentInstance.options = {
        secondaryTpl: fixture.componentInstance.secondaryTplRef,
      };
      await apply();

      const secondary = query('secondary');

      expect(secondary?.className).toContain('smart:border-s');
      expect(secondary?.className).toContain('smart:bg-white');
      expect(secondary?.className).toContain('smart:dark:bg-gray-800');
    });

    it('should use the sm secondary width (w-64) by default', async () => {
      fixture.componentInstance.options = {
        secondaryTpl: fixture.componentInstance.secondaryTplRef,
      };
      await apply();

      expect(query('secondary')?.className).toContain('smart:w-64');
    });

    it('should apply the md secondary width (w-80)', async () => {
      fixture.componentInstance.options = {
        secondaryTpl: fixture.componentInstance.secondaryTplRef,
        secondaryWidth: 'md',
      };
      await apply();

      const secondary = query('secondary');

      expect(secondary?.className).toContain('smart:w-80');
      expect(secondary?.className).not.toContain('smart:w-64');
    });

    it('should apply the lg secondary width (w-96)', async () => {
      fixture.componentInstance.options = {
        secondaryTpl: fixture.componentInstance.secondaryTplRef,
        secondaryWidth: 'lg',
      };
      await apply();

      const secondary = query('secondary');

      expect(secondary?.className).toContain('smart:w-96');
      expect(secondary?.className).not.toContain('smart:w-64');
    });
  });

  describe('preset-classes.util', () => {
    it('should map content width to a constrained container', () => {
      expect(
        getMultiColumnLayoutContentContainerClasses('constrained'),
      ).toContain('smart:max-w-7xl');
      expect(
        getMultiColumnLayoutContentContainerClasses('constrained'),
      ).toContain('smart:mx-auto');
    });

    it('should map content width to a full-width container', () => {
      expect(getMultiColumnLayoutContentContainerClasses('full')).toContain(
        'smart:max-w-none',
      );
    });

    it('should default an undefined content width to full width', () => {
      expect(getMultiColumnLayoutContentContainerClasses(undefined)).toContain(
        'smart:max-w-none',
      );
    });

    it('should map secondaryWidth values to fixed widths', () => {
      expect(getMultiColumnLayoutSecondaryClasses('sm')).toContain(
        'smart:w-64',
      );
      expect(getMultiColumnLayoutSecondaryClasses('md')).toContain(
        'smart:w-80',
      );
      expect(getMultiColumnLayoutSecondaryClasses('lg')).toContain(
        'smart:w-96',
      );
    });

    it('should default an undefined secondaryWidth to sm (w-64)', () => {
      expect(getMultiColumnLayoutSecondaryClasses(undefined)).toContain(
        'smart:w-64',
      );
    });
  });
});
