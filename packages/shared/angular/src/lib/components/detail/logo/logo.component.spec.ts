import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from '@smartsoft001/models';

import { DetailLogoComponent } from './logo.component';
import { IDetailOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-logo
      [options]="options"
      [class]="cssClass"
    ></smart-detail-logo>
  `,
  imports: [DetailLogoComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailLogoComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render <img> with src from options.item()[key]', () => {
    host.options = {
      key: 'logo',
      item: signal({ logo: 'https://example.com/logo.png' } as any),
      options: { type: FieldType.logo },
    };
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');

    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('https://example.com/logo.png');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'logo',
      item: signal(undefined),
      options: { type: FieldType.logo },
    };
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');

    expect(img).toBeFalsy();
  });

  it('should append cssClass to the <img> element', () => {
    host.options = {
      key: 'logo',
      item: signal({ logo: 'https://example.com/logo.png' } as any),
      options: { type: FieldType.logo },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');

    expect(img.className).toContain('my-custom-class');
    expect(img.className).toContain('smart:h-[150px]');
  });
});
