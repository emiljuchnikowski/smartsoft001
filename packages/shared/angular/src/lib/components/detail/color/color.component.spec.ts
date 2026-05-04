import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from '@smartsoft001/models';

import { DetailColorComponent } from './color.component';
import { IDetailOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-color
      [options]="options"
      [class]="cssClass"
    ></smart-detail-color>
  `,
  imports: [DetailColorComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailColorComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render <div> with background-color from options.item()[key]', () => {
    host.options = {
      key: 'brand',
      item: signal({ brand: '#ff0000' } as any),
      options: { type: FieldType.color },
    };
    fixture.detectChanges();

    const div = fixture.nativeElement.querySelector('div');

    expect(div).toBeTruthy();
    expect(div.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'brand',
      item: signal(undefined),
      options: { type: FieldType.color },
    };
    fixture.detectChanges();

    const div = fixture.nativeElement.querySelector('div');

    expect(div).toBeFalsy();
  });

  it('should append cssClass to the <div> element', () => {
    host.options = {
      key: 'brand',
      item: signal({ brand: '#00ff00' } as any),
      options: { type: FieldType.color },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const div = fixture.nativeElement.querySelector('div');

    expect(div.className).toContain('my-custom-class');
    expect(div.className).toContain('smart:rounded');
  });
});
