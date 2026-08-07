import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from '@smartsoft001/models';

import { DetailEmailPresetComponent } from './preset.component';
import { IDetailOptions } from '../../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-email-preset
      [options]="options"
      [class]="cssClass"
    ></smart-detail-email-preset>
  `,
  imports: [DetailEmailPresetComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailEmailPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render a mailto link with the email value', () => {
    host.options = {
      key: 'email',
      item: signal({ email: 'user@example.com' } as any),
      options: { type: FieldType.email },
    };
    fixture.detectChanges();

    const link = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="link"]',
    ) as HTMLAnchorElement;

    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('mailto:user@example.com');
    expect(link.textContent).toContain('user@example.com');
  });

  it('should render the envelope icon', () => {
    host.options = {
      key: 'email',
      item: signal({ email: 'user@example.com' } as any),
      options: { type: FieldType.email },
    };
    fixture.detectChanges();

    const icon = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="icon"]',
    );

    expect(icon).toBeTruthy();
  });

  it('should apply the blue link classes', () => {
    host.options = {
      key: 'email',
      item: signal({ email: 'user@example.com' } as any),
      options: { type: FieldType.email },
    };
    fixture.detectChanges();

    const link = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="link"]',
    ) as HTMLAnchorElement;

    expect(link.className).toContain('smart:text-blue-600');
    expect(link.className).toContain('smart:hover:underline');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'email',
      item: signal(undefined),
      options: { type: FieldType.email },
    };
    fixture.detectChanges();

    const link = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="link"]',
    );

    expect(link).toBeFalsy();
  });

  it('should append cssClass to the link', () => {
    host.options = {
      key: 'email',
      item: signal({ email: 'user@example.com' } as any),
      options: { type: FieldType.email },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const link = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="link"]',
    ) as HTMLAnchorElement;

    expect(link.className).toContain('my-custom-class');
    expect(link.className).toContain('smart:text-blue-600');
  });
});
