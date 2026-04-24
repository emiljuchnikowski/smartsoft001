import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from '@smartsoft001/models';

import { DetailArrayComponent } from './array.component';
import { IDetailOptions } from '../../../models';
import { DETAILS_COMPONENT_TOKEN } from '../../../shared.inectors';

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
    <smart-detail-array
      [options]="options"
      [class]="cssClass"
    ></smart-detail-array>
  `,
  imports: [DetailArrayComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailArrayComponent', () => {
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

  it('should render wrapper <div> when options.item()[key] is an array', () => {
    host.options = {
      key: 'items',
      item: signal({ items: [{ id: 'a' }, { id: 'b' }] } as any),
      options: { type: FieldType.object },
    };
    fixture.detectChanges();

    const div = fixture.nativeElement.querySelector('div');

    expect(div).toBeTruthy();
    expect(div.className).toContain('smart:mt-2');
    expect(div.className).toContain('smart:space-y-2');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'items',
      item: signal(undefined),
      options: { type: FieldType.object },
    };
    fixture.detectChanges();

    const div = fixture.nativeElement.querySelector('div');

    expect(div).toBeFalsy();
  });

  it('should append cssClass to the wrapper <div>', () => {
    host.options = {
      key: 'items',
      item: signal({ items: [{ id: 'a' }] } as any),
      options: { type: FieldType.object },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const div = fixture.nativeElement.querySelector('div');

    expect(div.className).toContain('my-custom-class');
    expect(div.className).toContain('smart:mt-2');
  });
});
