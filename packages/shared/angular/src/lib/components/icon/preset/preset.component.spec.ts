import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  getIconContainerClasses,
  getIconSizeClasses,
  IconPresetSize,
  IconPresetVariant,
} from './preset-classes.util';
import { IconPresetComponent } from './preset.component';

@Component({
  imports: [IconPresetComponent],
  template: `
    <ng-template #custom>
      <svg data-role="custom-icon" viewBox="0 0 24 24"></svg>
    </ng-template>
    <smart-icon-preset [template]="tpl" />
  `,
})
class TemplateHostComponent {
  @ViewChild('custom', { static: true })
  tpl!: TemplateRef<unknown>;
}

const VARIANTS: IconPresetVariant[] = ['plain', 'contained', 'soft'];
const SIZES: IconPresetSize[] = ['sm', 'md', 'lg'];

describe('@smartsoft001/shared-angular: icon preset classes util', () => {
  describe('getIconSizeClasses', () => {
    it('should map each size to its icon footprint', () => {
      expect(getIconSizeClasses('sm')).toBe('smart:size-4');
      expect(getIconSizeClasses('md')).toBe('smart:size-5');
      expect(getIconSizeClasses('lg')).toBe('smart:size-6');
    });
  });

  describe('getIconContainerClasses', () => {
    it('should center content with inline-flex for every variant and size', () => {
      for (const variant of VARIANTS) {
        for (const size of SIZES) {
          const classes = getIconContainerClasses(variant, size);

          expect(classes).toContain('smart:inline-flex');
          expect(classes).toContain('smart:items-center');
          expect(classes).toContain('smart:justify-center');
        }
      }
    });

    it('should render no box for the plain variant', () => {
      for (const size of SIZES) {
        const classes = getIconContainerClasses('plain', size);

        expect(classes).not.toContain('smart:border');
        expect(classes).not.toContain('smart:rounded');
        expect(classes).not.toContain('smart:bg-');
      }
    });

    it('should render a bordered square box for the contained variant', () => {
      const classes = getIconContainerClasses('contained', 'md');

      expect(classes).toContain('smart:rounded-lg');
      expect(classes).toContain('smart:border');
      expect(classes).toContain('smart:border-gray-200');
      expect(classes).toContain('smart:bg-white');
      expect(classes).toContain('smart:shadow-2xs');
      expect(classes).toContain('smart:text-gray-700');
    });

    it('should include dark twins for the contained variant', () => {
      const classes = getIconContainerClasses('contained', 'md');

      expect(classes).toContain('smart:dark:');
    });

    it('should render a tinted round box for the soft variant', () => {
      const classes = getIconContainerClasses('soft', 'md');

      expect(classes).toContain('smart:rounded-full');
      expect(classes).toContain('smart:bg-blue-50');
      expect(classes).toContain('smart:text-blue-600');
      expect(classes).toContain('smart:dark:bg-blue-900/30');
      expect(classes).toContain('smart:dark:text-blue-400');
    });
  });
});

describe('@smartsoft001/shared-angular: IconPresetComponent', () => {
  let fixture: ComponentFixture<IconPresetComponent>;
  let component: IconPresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconPresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(IconPresetComponent);
  });

  it('should expose the container via a data-role attribute', () => {
    const container = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="icon-preset"]',
    );

    expect(container).toBeTruthy();
  });

  it('should render the icon svg from smart-icon by default', () => {
    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg');

    expect(svg).toBeTruthy();
  });

  it('should render the requested icon name', () => {
    fixture.componentRef.setInput('name', 'chevron-down');
    fixture.detectChanges();

    const chevron = (fixture.nativeElement as HTMLElement).querySelector(
      'smart-icon-chevron-down',
    );

    expect(chevron).toBeTruthy();
  });

  it('should size the icon according to the size input', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    const icon = (fixture.nativeElement as HTMLElement).querySelector(
      'smart-icon svg',
    );

    expect(icon?.getAttribute('class')).toContain('smart:size-6');
  });

  it('should apply the container classes for the requested variant', () => {
    fixture.componentRef.setInput('variant', 'contained');
    fixture.detectChanges();

    const container = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="icon-preset"]',
    );

    expect(container?.className).toContain('smart:border');
    expect(container?.className).toContain('smart:rounded-lg');
  });

  it('should merge the external cssClass onto the container', () => {
    fixture.componentRef.setInput('variant', 'soft');
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const container = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="icon-preset"]',
    );

    expect(container?.className).toContain('my-extra-class');
    expect(container?.className).toContain('smart:rounded-full');
  });

  it('should accept the "class" alias for cssClass', () => {
    fixture.componentRef.setInput('class', 'aliased-class');
    fixture.detectChanges();

    const container = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="icon-preset"]',
    );

    expect(container?.className).toContain('aliased-class');
  });
});

describe('@smartsoft001/shared-angular: IconPresetComponent template override', () => {
  it('should render the overriding template instead of the switch icon', () => {
    TestBed.configureTestingModule({
      imports: [TemplateHostComponent],
    });
    const hostFixture = TestBed.createComponent(TemplateHostComponent);
    hostFixture.detectChanges();

    const custom = (hostFixture.nativeElement as HTMLElement).querySelector(
      '[data-role="custom-icon"]',
    );
    const spinner = (hostFixture.nativeElement as HTMLElement).querySelector(
      'smart-icon-spinner',
    );

    expect(custom).toBeTruthy();
    expect(spinner).toBeNull();
  });
});
