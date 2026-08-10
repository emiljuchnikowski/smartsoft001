import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from '@smartsoft001/models';

import { DetailFlagPresetComponent } from './preset.component';
import { IDetailOptions } from '../../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-flag-preset
      [options]="options"
      [class]="cssClass"
    ></smart-detail-flag-preset>
  `,
  imports: [DetailFlagPresetComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailFlagPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render a soft green badge when the flag is truthy', () => {
    host.options = {
      key: 'isActive',
      item: signal({ isActive: true } as any),
      options: { type: FieldType.flag },
    };
    fixture.detectChanges();

    const badge = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="badge"]',
    ) as HTMLElement;

    expect(badge).toBeTruthy();
    expect(badge.className).toContain('smart:bg-green-100');
    expect(badge.textContent).toContain('✓');
  });

  it('should render a soft red badge when the flag is falsy', () => {
    host.options = {
      key: 'isActive',
      item: signal({ isActive: false } as any),
      options: { type: FieldType.flag },
    };
    fixture.detectChanges();

    const badge = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="badge"]',
    ) as HTMLElement;

    expect(badge).toBeTruthy();
    expect(badge.className).toContain('smart:bg-red-100');
    expect(badge.textContent).toContain('✗');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'isActive',
      item: signal(undefined),
      options: { type: FieldType.flag },
    };
    fixture.detectChanges();

    const badge = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="badge"]',
    );

    expect(badge).toBeFalsy();
  });

  it('should append cssClass to the badge', () => {
    host.options = {
      key: 'isActive',
      item: signal({ isActive: true } as any),
      options: { type: FieldType.flag },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const badge = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="badge"]',
    ) as HTMLElement;

    expect(badge.className).toContain('my-custom-class');
    expect(badge.className).toContain('smart:bg-green-100');
  });
});
