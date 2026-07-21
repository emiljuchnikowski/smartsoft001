import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from '@smartsoft001/models';

import { DetailColorPresetComponent } from './preset.component';
import { IDetailOptions } from '../../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-color-preset
      [options]="options"
      [class]="cssClass"
    ></smart-detail-color-preset>
  `,
  imports: [DetailColorPresetComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailColorPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render a swatch with the color as background', () => {
    host.options = {
      key: 'color',
      item: signal({ color: '#4f46e5' } as any),
      options: { type: FieldType.color },
    };
    fixture.detectChanges();

    const swatch = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="swatch"]',
    ) as HTMLElement;

    expect(swatch).toBeTruthy();
    expect(swatch.style.backgroundColor).toBe('rgb(79, 70, 229)');
    expect(swatch.className).toContain('smart:size-6');
    expect(swatch.className).toContain('smart:rounded-md');
    expect(swatch.className).toContain('smart:border');
  });

  it('should render the hex code text', () => {
    host.options = {
      key: 'color',
      item: signal({ color: '#4f46e5' } as any),
      options: { type: FieldType.color },
    };
    fixture.detectChanges();

    const value = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="value"]',
    ) as HTMLElement;

    expect(value.textContent?.trim()).toBe('#4f46e5');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'color',
      item: signal(undefined),
      options: { type: FieldType.color },
    };
    fixture.detectChanges();

    const swatch = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="swatch"]',
    );

    expect(swatch).toBeFalsy();
  });

  it('should append cssClass to the container', () => {
    host.options = {
      key: 'color',
      item: signal({ color: '#4f46e5' } as any),
      options: { type: FieldType.color },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const container = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="color"]',
    ) as HTMLElement;

    expect(container.className).toContain('my-custom-class');
    expect(container.className).toContain('smart:inline-flex');
  });
});
