import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from '@smartsoft001/models';

import { DetailObjectPresetComponent } from './preset.component';
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
    <smart-detail-object-preset
      [options]="options"
      [class]="cssClass"
    ></smart-detail-object-preset>
  `,
  imports: [DetailObjectPresetComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailObjectPresetComponent', () => {
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

  it('should render the nested details inside a card envelope', () => {
    host.options = {
      key: 'nested',
      item: signal({ nested: { id: 'x' } } as any),
      options: { type: FieldType.object },
    };
    fixture.detectChanges();

    const envelope = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="object"]',
    ) as HTMLElement;

    expect(envelope).toBeTruthy();
    expect(envelope.querySelector('.mock-details')).toBeTruthy();
  });

  it('should apply the card classes with dark mode twins', () => {
    host.options = {
      key: 'nested',
      item: signal({ nested: { id: 'x' } } as any),
      options: { type: FieldType.object },
    };
    fixture.detectChanges();

    const envelope = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="object"]',
    ) as HTMLElement;

    expect(envelope.className).toContain('smart:rounded-lg');
    expect(envelope.className).toContain('smart:border-gray-200');
    expect(envelope.className).toContain('smart:dark:border-gray-700');
    expect(envelope.className).toContain('smart:bg-white');
    expect(envelope.className).toContain('smart:dark:bg-gray-800');
  });

  it('should render a placeholder when options.item() is undefined', () => {
    host.options = {
      key: 'nested',
      item: signal(undefined),
      options: { type: FieldType.object },
    };
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.querySelector('[data-role="object"]')).toBeFalsy();
    expect(nativeElement.querySelector('[data-role="empty"]')).toBeTruthy();
  });

  it('should append cssClass to the card envelope', () => {
    host.options = {
      key: 'nested',
      item: signal({ nested: { id: 'y' } } as any),
      options: { type: FieldType.object },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const envelope = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="object"]',
    ) as HTMLElement;

    expect(envelope.className).toContain('my-custom-class');
    expect(envelope.className).toContain('smart:rounded-lg');
  });
});
