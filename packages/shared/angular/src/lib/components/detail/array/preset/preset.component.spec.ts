import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from '@smartsoft001/models';

import { DetailArrayPresetComponent } from './preset.component';
import { IDetailOptions } from '../../../../models';
import { DETAILS_COMPONENT_TOKEN } from '../../../../shared.inectors';

@Component({
  selector: 'mock-details',
  standalone: true,
  template: '<div class="mock-details">mock</div>',
})
class MockDetailsComponent {
  options = input<unknown>();
}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-array-preset
      [options]="options"
      [class]="cssClass"
    ></smart-detail-array-preset>
  `,
  imports: [DetailArrayPresetComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailArrayPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: DETAILS_COMPONENT_TOKEN, useValue: MockDetailsComponent },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render one card per array item', () => {
    host.options = {
      key: 'items',
      item: signal({ items: [{ id: 'a' }, { id: 'b' }] } as any),
      options: { type: FieldType.object },
    };
    fixture.detectChanges();

    const items = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-role="item"]',
    );

    expect(items.length).toBe(2);
    expect(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.mock-details')
        .length,
    ).toBe(2);
  });

  it('should render the empty placeholder when the array is empty', () => {
    host.options = {
      key: 'items',
      item: signal({ items: [] } as any),
      options: { type: FieldType.object },
    };
    fixture.detectChanges();

    const empty = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="empty"]',
    ) as HTMLElement;

    expect(empty).toBeTruthy();
    expect(empty.textContent?.trim()).toBe('—');
    expect(empty.className).toContain('smart:text-gray-400');
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        '[data-role="item"]',
      ),
    ).toBeFalsy();
  });

  it('should render the empty placeholder when options.item() is undefined', () => {
    host.options = {
      key: 'items',
      item: signal(undefined),
      options: { type: FieldType.object },
    };
    fixture.detectChanges();

    const empty = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="empty"]',
    );

    expect(empty).toBeTruthy();
  });

  it('should apply the card stack classes with dark mode twins', () => {
    host.options = {
      key: 'items',
      item: signal({ items: [{ id: 'a' }] } as any),
      options: { type: FieldType.object },
    };
    fixture.detectChanges();

    const array = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="array"]',
    ) as HTMLElement;
    const item = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="item"]',
    ) as HTMLElement;

    expect(array.className).toContain('smart:space-y-2');
    expect(item.className).toContain('smart:rounded-lg');
    expect(item.className).toContain('smart:border-gray-200');
    expect(item.className).toContain('smart:dark:border-gray-700');
    expect(item.className).toContain('smart:bg-white');
    expect(item.className).toContain('smart:dark:bg-gray-800');
  });

  it('should append cssClass to the array envelope', () => {
    host.options = {
      key: 'items',
      item: signal({ items: [{ id: 'a' }] } as any),
      options: { type: FieldType.object },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const array = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="array"]',
    ) as HTMLElement;

    expect(array.className).toContain('my-custom-class');
    expect(array.className).toContain('smart:space-y-2');
  });
});
