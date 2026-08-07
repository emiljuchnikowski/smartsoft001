import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from '@smartsoft001/models';

import { DetailLogoPresetComponent } from './preset.component';
import { IDetailOptions } from '../../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-logo-preset
      [options]="options"
      [class]="cssClass"
    ></smart-detail-logo-preset>
  `,
  imports: [DetailLogoPresetComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailLogoPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render an <img> with src from the item value', () => {
    host.options = {
      key: 'logo',
      item: signal({ logo: 'https://example.com/logo.png' } as any),
      options: { type: FieldType.logo },
    };
    fixture.detectChanges();

    const img = (fixture.nativeElement as HTMLElement).querySelector(
      'img[data-role="logo"]',
    ) as HTMLImageElement;

    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('https://example.com/logo.png');
  });

  it('should apply the compact contained logo classes', () => {
    host.options = {
      key: 'logo',
      item: signal({ logo: 'https://example.com/logo.png' } as any),
      options: { type: FieldType.logo },
    };
    fixture.detectChanges();

    const img = (fixture.nativeElement as HTMLElement).querySelector(
      'img[data-role="logo"]',
    ) as HTMLImageElement;

    expect(img.className).toContain('smart:max-h-10');
    expect(img.className).toContain('smart:object-contain');
  });

  it('should render nothing when the value is empty', () => {
    host.options = {
      key: 'logo',
      item: signal({ logo: '' } as any),
      options: { type: FieldType.logo },
    };
    fixture.detectChanges();

    const img = (fixture.nativeElement as HTMLElement).querySelector('img');

    expect(img).toBeFalsy();
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'logo',
      item: signal(undefined),
      options: { type: FieldType.logo },
    };
    fixture.detectChanges();

    const img = (fixture.nativeElement as HTMLElement).querySelector('img');

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

    const img = (fixture.nativeElement as HTMLElement).querySelector(
      'img[data-role="logo"]',
    ) as HTMLImageElement;

    expect(img.className).toContain('my-custom-class');
    expect(img.className).toContain('smart:max-h-10');
  });
});
