import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FieldType } from '@smartsoft001/models';

import { DetailPhoneNumberPlPresetComponent } from './preset.component';
import { IDetailOptions } from '../../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-phone-number-pl-preset
      [options]="options"
      [class]="cssClass"
    ></smart-detail-phone-number-pl-preset>
  `,
  imports: [DetailPhoneNumberPlPresetComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailPhoneNumberPlPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render a tel: badge link with the phone value', () => {
    host.options = {
      key: 'phone',
      item: signal({ phone: '500600700' } as any),
      options: { type: FieldType.phoneNumberPl },
    };
    fixture.detectChanges();

    const link = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="link"]',
    ) as HTMLAnchorElement;

    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('tel:48500600700');
    expect(link.innerHTML).toContain('500600700');
    expect(link.className).toContain('smart:bg-blue-100');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'phone',
      item: signal(undefined),
      options: { type: FieldType.phoneNumberPl },
    };
    fixture.detectChanges();

    const link = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="link"]',
    );

    expect(link).toBeFalsy();
  });

  it('should append cssClass to the link', () => {
    host.options = {
      key: 'phone',
      item: signal({ phone: '500600700' } as any),
      options: { type: FieldType.phoneNumberPl },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const link = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="link"]',
    ) as HTMLAnchorElement;

    expect(link.className).toContain('my-custom-class');
    expect(link.className).toContain('smart:bg-blue-100');
  });
});
