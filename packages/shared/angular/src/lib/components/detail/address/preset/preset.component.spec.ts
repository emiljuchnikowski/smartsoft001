import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IAddress } from '@smartsoft001/domain-core';
import { FieldType } from '@smartsoft001/models';

import { DetailAddressPresetComponent } from './preset.component';
import { IDetailOptions } from '../../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-address-preset
      [options]="options"
      [class]="cssClass"
    ></smart-detail-address-preset>
  `,
  imports: [DetailAddressPresetComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

const ADDRESS: IAddress = {
  city: 'Warszawa',
  street: 'Marszałkowska',
  zipCode: '00-001',
  flatNumber: '5',
  buildingNumber: '3B',
};

describe('@smartsoft001/shared-angular: DetailAddressPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render the address block with street, zip and city', () => {
    host.options = {
      key: 'address',
      item: signal({ address: ADDRESS } as any),
      options: { type: FieldType.address },
    };
    fixture.detectChanges();

    const block = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="address"]',
    ) as HTMLElement;

    expect(block).toBeTruthy();
    expect(block.textContent).toContain('Marszałkowska');
    expect(block.textContent).toContain('00-001');
    expect(block.textContent).toContain('Warszawa');
  });

  it('should render the pin icon', () => {
    host.options = {
      key: 'address',
      item: signal({ address: ADDRESS } as any),
      options: { type: FieldType.address },
    };
    fixture.detectChanges();

    const icon = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="icon"]',
    );

    expect(icon).toBeTruthy();
  });

  it('should render nothing when the address is undefined', () => {
    host.options = {
      key: 'address',
      item: signal(undefined),
      options: { type: FieldType.address },
    };
    fixture.detectChanges();

    const block = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="address"]',
    );

    expect(block).toBeFalsy();
  });

  it('should append cssClass to the container', () => {
    host.options = {
      key: 'address',
      item: signal({ address: ADDRESS } as any),
      options: { type: FieldType.address },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const block = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="address"]',
    ) as HTMLElement;

    expect(block.className).toContain('my-custom-class');
    expect(block.className).toContain('smart:flex');
  });
});
