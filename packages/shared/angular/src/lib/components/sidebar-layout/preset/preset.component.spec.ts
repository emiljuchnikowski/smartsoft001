import {
  ChangeDetectorRef,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarLayoutPresetComponent } from './preset.component';
import { ISidebarLayoutOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <ng-template #sidebarTpl><a class="nav-link">Home</a></ng-template>
    <ng-template #headerTpl
      ><div class="header-content">Header content</div></ng-template
    >
    <smart-sidebar-layout-preset [options]="options" [cssClass]="cssClass">
      <p class="projected">Main content</p>
    </smart-sidebar-layout-preset>
  `,
  imports: [SidebarLayoutPresetComponent],
})
class TestHostComponent {
  @ViewChild('sidebarTpl', { static: true })
  sidebarTplRef!: TemplateRef<unknown>;
  @ViewChild('headerTpl', { static: true }) headerTplRef!: TemplateRef<unknown>;

  options: ISidebarLayoutOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: SidebarLayoutPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let preset: SidebarLayoutPresetComponent;

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
    fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  describe('creation', () => {
    it('should create an instance', () => {
      expect(preset).toBeInstanceOf(SidebarLayoutPresetComponent);
    });
  });

  describe('zones', () => {
    it('should render the page root zone with gray surface classes', () => {
      const root = query('root');

      expect(root).toBeTruthy();
      expect(root?.className).toContain('smart:min-h-full');
      expect(root?.className).toContain('smart:bg-gray-50');
      expect(root?.className).toContain('smart:dark:bg-gray-900');
    });

    it('should render the sidebar zone with white surface classes', () => {
      const sidebar = query('sidebar');

      expect(sidebar).toBeTruthy();
      expect(sidebar?.tagName).toBe('ASIDE');
      expect(sidebar?.className).toContain('smart:bg-white');
      expect(sidebar?.className).toContain('smart:dark:bg-gray-800');
      expect(sidebar?.className).toContain('smart:shrink-0');
    });

    it('should render the content zone with gray page surface classes', () => {
      const content = query('content');

      expect(content).toBeTruthy();
      expect(content?.tagName).toBe('MAIN');
      expect(content?.className).toContain('smart:bg-gray-50');
      expect(content?.className).toContain('smart:dark:bg-gray-900');
    });
  });

  describe('content projection', () => {
    it('should project ng-content into the content zone', () => {
      const projected = query('content')?.querySelector('p.projected');

      expect(projected).toBeTruthy();
      expect(projected?.textContent).toContain('Main content');
    });
  });

  describe('sidebar template', () => {
    it('should render options.sidebarTpl inside the sidebar zone', async () => {
      fixture.componentInstance.options = {
        sidebarTpl: fixture.componentInstance.sidebarTplRef,
      };
      await apply();

      const link = query('sidebar')?.querySelector('a.nav-link');

      expect(link).toBeTruthy();
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
      expect(header?.textContent).toContain('Header content');
    });

    it('should render the title as fallback when headerTpl is absent', async () => {
      fixture.componentInstance.options = { title: 'Dashboard' };
      await apply();

      const title = query('title');

      expect(title).toBeTruthy();
      expect(title?.textContent?.trim()).toBe('Dashboard');
      expect(title?.className).toContain('smart:text-2xl');
      expect(title?.className).toContain('smart:font-semibold');
      expect(title?.className).toContain('smart:dark:text-white');
    });

    it('should prefer headerTpl over the title fallback', async () => {
      fixture.componentInstance.options = {
        title: 'Dashboard',
        headerTpl: fixture.componentInstance.headerTplRef,
      };
      await apply();

      expect(query('title')).toBeNull();
      expect(query('header')?.textContent).toContain('Header content');
    });

    it('should style the header zone like the stacked-layout preset header', async () => {
      fixture.componentInstance.options = { title: 'Dashboard' };
      await apply();

      const header = query('header');

      expect(header?.className).toContain('smart:bg-white');
      expect(header?.className).toContain('smart:dark:bg-gray-800');
      expect(header?.className).toContain('smart:border-b');
    });
  });

  describe('sidebar position', () => {
    it('should use a left border-end and no reversed row for the default left sidebar', () => {
      const row = query('row');
      const sidebar = query('sidebar');

      expect(row?.className).toContain('smart:flex');
      expect(row?.className).not.toContain('smart:flex-row-reverse');
      expect(sidebar?.className).toContain('smart:border-e');
      expect(sidebar?.className).not.toContain('smart:border-s');
    });

    it('should reverse the row and use a start border for a right sidebar', async () => {
      fixture.componentInstance.options = { sidebarPosition: 'right' };
      await apply();

      const row = query('row');
      const sidebar = query('sidebar');

      expect(row?.className).toContain('smart:flex-row-reverse');
      expect(sidebar?.className).toContain('smart:border-s');
      expect(sidebar?.className).not.toContain('smart:border-e');
    });
  });

  describe('condensed', () => {
    it('should use the full sidebar width by default', () => {
      expect(query('sidebar')?.className).toContain('smart:w-64');
    });

    it('should narrow the sidebar when condensed is true', async () => {
      fixture.componentInstance.options = { condensed: true };
      await apply();

      const sidebar = query('sidebar');

      expect(sidebar?.className).toContain('smart:w-16');
      expect(sidebar?.className).not.toContain('smart:w-64');
    });
  });

  describe('cssClass', () => {
    it('should merge cssClass onto the root zone (canonical name)', async () => {
      fixture.componentInstance.cssClass = 'my-extra-class';
      await apply();

      expect(query('root')?.className).toContain('my-extra-class');
      expect(query('root')?.className).toContain('smart:min-h-full');
    });
  });
});
