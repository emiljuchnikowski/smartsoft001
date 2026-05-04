import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from '@smartsoft001/models';

import { DetailAddressComponent } from './address.component';
import { IDetailOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-address
      [options]="options"
      [class]="cssClass"
    ></smart-detail-address>
  `,
  imports: [DetailAddressComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailAddressComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render <p> with address data from options.item()[key]', () => {
    host.options = {
      key: 'address',
      item: signal({
        address: {
          street: 'Main',
          buildingNumber: '12',
          flatNumber: '3',
          zipCode: '00-001',
          city: 'Warsaw',
        },
      } as any),
      options: { type: FieldType.text },
    };
    fixture.detectChanges();

    const p = fixture.nativeElement.querySelector('p');

    expect(p).toBeTruthy();
    expect(p.textContent).toContain('Main');
    expect(p.textContent).toContain('12/3');
    expect(p.textContent).toContain('00-001');
    expect(p.textContent).toContain('Warsaw');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'address',
      item: signal(undefined),
      options: { type: FieldType.text },
    };
    fixture.detectChanges();

    const p = fixture.nativeElement.querySelector('p');

    expect(p).toBeFalsy();
  });

  it('should append cssClass to the <p> element', () => {
    host.options = {
      key: 'address',
      item: signal({
        address: {
          street: 'Main',
          buildingNumber: '5',
          zipCode: '00-002',
          city: 'Warsaw',
        },
      } as any),
      options: { type: FieldType.text },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const p = fixture.nativeElement.querySelector('p');

    expect(p.className).toContain('my-custom-class');
    expect(p.className).toContain('smart:text-sm');
  });
});
