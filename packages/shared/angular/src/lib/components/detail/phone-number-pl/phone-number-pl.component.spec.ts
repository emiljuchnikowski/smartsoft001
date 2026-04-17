import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FieldType } from '@smartsoft001/models';

import { DetailPhoneNumberPlComponent } from './phone-number-pl.component';
import { IDetailOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-phone-number-pl
      [options]="options"
      [class]="cssClass"
    ></smart-detail-phone-number-pl>
  `,
  imports: [DetailPhoneNumberPlComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailPhoneNumberPlComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render <a> with tel: href from options.item()[key]', () => {
    host.options = {
      key: 'phone',
      item: signal({ phone: '500600700' } as any),
      options: { type: FieldType.phoneNumberPl },
    };
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a');

    expect(anchor).toBeTruthy();
    expect(anchor.getAttribute('href')).toBe('tel:48500600700');
    expect(anchor.innerHTML).toContain('500600700');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'phone',
      item: signal(undefined),
      options: { type: FieldType.phoneNumberPl },
    };
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a');

    expect(anchor).toBeFalsy();
  });

  it('should append cssClass to the <a> element', () => {
    host.options = {
      key: 'phone',
      item: signal({ phone: '500600700' } as any),
      options: { type: FieldType.phoneNumberPl },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a');

    expect(anchor.className).toContain('my-custom-class');
    expect(anchor.className).toContain('smart:inline-flex');
  });
});
