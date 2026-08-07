import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { getContainerClasses } from './preset-classes.util';
import { ContainerPresetComponent } from './preset.component';
import { IContainerOptions } from '../../../models';

type Mode = 'container' | 'constrained' | 'full-width' | 'unset';
type Padding = 'always' | 'mobile' | 'none' | 'unset';

describe('@smartsoft001/shared-angular: getContainerClasses', () => {
  const MODE_BASE: Record<Mode, string> = {
    container: 'smart:mx-auto smart:max-w-7xl',
    constrained: 'smart:mx-auto smart:max-w-5xl',
    'full-width': 'smart:w-full',
    unset: 'smart:w-full',
  };

  const NARROW_BASE: Record<Mode, string> = {
    container: 'smart:mx-auto smart:max-w-3xl',
    constrained: 'smart:mx-auto smart:max-w-3xl',
    'full-width': 'smart:w-full smart:mx-auto smart:max-w-3xl',
    unset: 'smart:w-full smart:mx-auto smart:max-w-3xl',
  };

  const PAD: Record<Padding, string> = {
    always: 'smart:px-4 smart:sm:px-6 smart:lg:px-8',
    mobile: 'smart:px-4 smart:sm:px-0',
    none: '',
    unset: '',
  };

  const modes: Mode[] = ['container', 'constrained', 'full-width', 'unset'];
  const paddings: Padding[] = ['always', 'mobile', 'none', 'unset'];

  for (const mode of modes) {
    for (const padding of paddings) {
      for (const narrow of [false, true]) {
        const expected = [
          narrow ? NARROW_BASE[mode] : MODE_BASE[mode],
          PAD[padding],
        ]
          .filter(Boolean)
          .join(' ');

        it(`should map mode=${mode} padding=${padding} narrow=${narrow}`, () => {
          const modeArg = mode === 'unset' ? undefined : mode;
          const paddingArg = padding === 'unset' ? undefined : padding;

          const result = getContainerClasses(modeArg, paddingArg, narrow);

          expect(result).toBe(expected);
        });
      }
    }
  }

  it('should let narrow win over the mode max-width', () => {
    const result = getContainerClasses('container', 'none', true);

    expect(result).not.toContain('smart:max-w-7xl');
    expect(result).toContain('smart:max-w-3xl');
  });
});

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-container-preset [options]="options" [class]="cssClass">
      <p class="projected">Hello</p>
    </smart-container-preset>
  `,
  imports: [ContainerPresetComponent],
})
class TestHostComponent {
  options: IContainerOptions = {};
  cssClass = '';
}

describe('@smartsoft001/shared-angular: ContainerPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  function root(): HTMLElement {
    return (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="container"]',
    ) as HTMLElement;
  }

  it('should project content into the root container', () => {
    host.options = { mode: 'container' };
    fixture.detectChanges();

    expect(root().querySelector('p.projected')?.textContent).toContain('Hello');
  });

  it('should apply the mapped classes for the given options', () => {
    host.options = { mode: 'constrained', padding: 'always' };
    fixture.detectChanges();

    expect(root().className).toContain('smart:max-w-5xl');
    expect(root().className).toContain('smart:px-4');
    expect(root().className).toContain('smart:lg:px-8');
  });

  it('should merge the external cssClass into the root classes', () => {
    host.options = { mode: 'container' };
    host.cssClass = 'my-extra-class';
    fixture.detectChanges();

    expect(root().className).toContain('my-extra-class');
    expect(root().className).toContain('smart:max-w-7xl');
  });

  it('should render neutral full-width classes when no options are set', () => {
    fixture.detectChanges();

    expect(root().className).toContain('smart:w-full');
  });
});
