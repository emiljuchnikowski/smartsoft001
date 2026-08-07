import {
  ChangeDetectorRef,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedLayoutPresetComponent } from './preset.component';
import { IStackedLayoutOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <ng-template #navTpl
      ><div class="nav-content">Nav content</div></ng-template
    >
    <ng-template #headerTpl
      ><div class="header-content">Header content</div></ng-template
    >
    <smart-stacked-layout-preset [options]="options" [cssClass]="cssClass">
      <p class="projected">Main content</p>
    </smart-stacked-layout-preset>
  `,
  imports: [StackedLayoutPresetComponent],
})
class TestHostComponent {
  @ViewChild('navTpl', { static: true }) navTplRef!: TemplateRef<unknown>;
  @ViewChild('headerTpl', { static: true }) headerTplRef!: TemplateRef<unknown>;

  options: IStackedLayoutOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: StackedLayoutPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let preset: StackedLayoutPresetComponent;

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
      expect(preset).toBeInstanceOf(StackedLayoutPresetComponent);
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

    it('should render the header zone container', () => {
      const header = query('header');

      expect(header).toBeTruthy();
    });

    it('should render the content zone container', () => {
      const content = query('content');

      expect(content).toBeTruthy();
      expect(content?.className).toContain('smart:py-8');
    });

    it('should wrap projected content in a bordered content card', () => {
      const content = query('content');
      const card = content?.querySelector('div');

      expect(card?.className).toContain('smart:rounded-lg');
      expect(card?.className).toContain('smart:border');
      expect(card?.className).toContain('smart:bg-white');
      expect(card?.className).toContain('smart:dark:bg-gray-800');
    });
  });

  describe('content projection', () => {
    it('should project ng-content into the content card', () => {
      const projected = (fixture.nativeElement as HTMLElement).querySelector(
        'p.projected',
      );

      expect(projected).toBeTruthy();
      expect(projected?.textContent).toContain('Main content');
    });
  });

  describe('navigation and header templates', () => {
    it('should render navTpl inside the nav hook when provided', async () => {
      fixture.componentInstance.options = {
        navTpl: fixture.componentInstance.navTplRef,
      };
      await apply();

      const nav = query('nav');

      expect(nav).toBeTruthy();
      expect(nav?.textContent).toContain('Nav content');
    });

    it('should render headerTpl when provided', async () => {
      fixture.componentInstance.options = {
        headerTpl: fixture.componentInstance.headerTplRef,
      };
      await apply();

      const header = query('header');

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
  });

  describe('containerWidth mapping', () => {
    const cases: Array<[IStackedLayoutOptions['containerWidth'], string]> = [
      ['sm', 'smart:max-w-3xl'],
      ['md', 'smart:max-w-5xl'],
      ['lg', 'smart:max-w-6xl'],
      ['xl', 'smart:max-w-7xl'],
      ['full', 'smart:max-w-none'],
    ];

    it.each(cases)(
      'should map containerWidth "%s" to %s',
      async (width, expected) => {
        fixture.componentInstance.options = { containerWidth: width };
        await apply();

        expect(query('header')?.className).toContain(expected);
        expect(query('content')?.className).toContain(expected);
      },
    );

    it('should default to max-w-7xl when containerWidth is unset', () => {
      expect(query('header')?.className).toContain('smart:max-w-7xl');
      expect(query('content')?.className).toContain('smart:max-w-7xl');
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
