import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FieldType } from '@smartsoft001/models';

import { DetailTextPresetComponent } from './preset.component';
import { IDetailOptions } from '../../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-text-preset
      [options]="options"
      [class]="cssClass"
    ></smart-detail-text-preset>
  `,
  imports: [DetailTextPresetComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailTextPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render the plain text value', () => {
    host.options = {
      key: 'name',
      item: signal({ name: 'Hello World' } as any),
      options: { type: FieldType.text },
    };
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="text"]',
    ) as HTMLElement;

    expect(text).toBeTruthy();
    expect(text.textContent).toContain('Hello World');
  });

  it('should render html markup from the value', () => {
    host.options = {
      key: 'name',
      item: signal({ name: '<b>Bold</b> text' } as any),
      options: { type: FieldType.text },
    };
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="text"]',
    ) as HTMLElement;

    expect(text.querySelector('b')).toBeTruthy();
    expect(text.textContent).toContain('Bold text');
  });

  it('should strip event handlers and scripts from the value', () => {
    host.options = {
      key: 'name',
      item: signal({
        name: '<img src="x" onerror="void(0)"><script>void(0)</script><b>Product</b>',
      } as any),
      options: { type: FieldType.text },
    };
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="text"]',
    ) as HTMLElement;

    expect(text.querySelector('[onerror]')).toBeNull();
    expect(text.querySelector('script')).toBeNull();
    expect(text.querySelector('b')?.textContent).toBe('Product');
  });

  it('should sanitize html returned by a custom cellPipe', () => {
    host.options = {
      key: 'name',
      item: signal({ name: 'Raw value' } as any),
      options: { type: FieldType.text },
      cellPipe: {
        transform: () => '<a href="javascript:void(0)">Product</a>',
      },
    };
    fixture.detectChanges();

    const link = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="text"] a',
    ) as HTMLElement;

    expect(link.textContent).toBe('Product');
    expect(link.getAttribute('href')).not.toMatch(/^\s*javascript:/i);
  });

  it('should render an em dash placeholder when the value is empty', () => {
    host.options = {
      key: 'name',
      item: signal({ name: '' } as any),
      options: { type: FieldType.text },
    };
    fixture.detectChanges();

    const empty = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="empty"]',
    ) as HTMLElement;

    expect(empty).toBeTruthy();
    expect(empty.textContent).toContain('—');
    expect(empty.className).toContain('smart:text-gray-400');
  });

  it('should apply the preset typography classes', () => {
    host.options = {
      key: 'name',
      item: signal({ name: 'Hello World' } as any),
      options: { type: FieldType.text },
    };
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="text"]',
    ) as HTMLElement;

    expect(text.className).toContain('smart:text-sm');
    expect(text.className).toContain('smart:text-gray-900');
    expect(text.className).toContain('smart:dark:text-white');
    expect(text.className).toContain('smart:text-pretty');
  });

  it('should append cssClass to the text element', () => {
    host.options = {
      key: 'name',
      item: signal({ name: 'Hello World' } as any),
      options: { type: FieldType.text },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="text"]',
    ) as HTMLElement;

    expect(text.className).toContain('my-custom-class');
    expect(text.className).toContain('smart:text-sm');
  });
});
