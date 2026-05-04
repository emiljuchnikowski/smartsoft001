import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from '@smartsoft001/models';

import { DetailFlagComponent } from './flag.component';
import { IDetailOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-flag
      [options]="options"
      [class]="cssClass"
    ></smart-detail-flag>
  `,
  imports: [DetailFlagComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailFlagComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render check SVG when item[key] is truthy', () => {
    host.options = {
      key: 'active',
      item: signal({ active: true } as any),
      options: { type: FieldType.flag },
    };
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    const svg = span?.querySelector('svg');

    expect(span).toBeTruthy();
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('class')).toContain('smart:text-green-500');
  });

  it('should render x-mark SVG when item[key] is falsy', () => {
    host.options = {
      key: 'active',
      item: signal({ active: false } as any),
      options: { type: FieldType.flag },
    };
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    const svg = span?.querySelector('svg');

    expect(span).toBeTruthy();
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('class')).toContain('smart:text-gray-400');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'active',
      item: signal(undefined),
      options: { type: FieldType.flag },
    };
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span).toBeFalsy();
  });

  it('should append cssClass to the <span> element', () => {
    host.options = {
      key: 'active',
      item: signal({ active: true } as any),
      options: { type: FieldType.flag },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span.className).toContain('my-custom-class');
    expect(span.className).toContain('smart:inline-flex');
  });
});
