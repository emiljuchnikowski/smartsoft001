import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { InputAddressPresetComponent } from './preset.component';
import { InputOptions } from '../../../../models';
import { IModelLabelProvider } from '../../../../providers';

@Model({})
class AddressModel {
  @Field({ type: FieldType.address })
  address = {};
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-input-address-preset
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-address-preset>
  `,
  imports: [InputAddressPresetComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(control: FormGroup): InputOptions<AddressModel> {
  new FormGroup({ address: control });
  return {
    control: control as any,
    fieldKey: 'address',
    model: new AddressModel(),
    treeLevel: 0,
  };
}

function makeAddressGroup(required = false) {
  return new FormGroup(
    {
      city: new FormControl(''),
      zipCode: new FormControl(''),
      street: new FormControl(''),
      buildingNumber: new FormControl(''),
      flatNumber: new FormControl(''),
    },
    required ? [Validators.required] : [],
  );
}

describe('@smartsoft001/shared-angular: InputAddressPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render 5 address field inputs', () => {
    host.options = buildOptions(makeAddressGroup());
    fixture.detectChanges();

    const inputs = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'input[type="text"]',
    );

    expect(inputs.length).toBe(5);
  });

  it('should apply Preline preset classes to the sub-inputs', () => {
    host.options = buildOptions(makeAddressGroup());
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector(
      'input[type="text"]',
    );

    expect(input?.className).toContain('smart:rounded-lg');
    expect(input?.className).toContain('smart:border-gray-200');
    expect(input?.className).toContain('smart:focus:border-blue-700');
  });

  it('should render label with model label text', () => {
    host.options = buildOptions(makeAddressGroup());
    fixture.detectChanges();

    const label = (fixture.nativeElement as HTMLElement).querySelector('label');

    expect(label).toBeTruthy();
    expect(label?.textContent).toContain('Mock Label');
  });

  it('should render required asterisk when address group has a required field', () => {
    host.options = buildOptions(makeAddressGroup(true));
    fixture.detectChanges();

    const asterisks = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'label span',
    );

    expect(asterisks.length).toBeGreaterThan(0);
  });

  it('should bind the city sub-input to the form group control', () => {
    const group = makeAddressGroup();
    host.options = buildOptions(group);
    fixture.detectChanges();

    group.get('city')?.setValue('Warsaw');
    fixture.detectChanges();

    const cityInput = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="city"]',
    ) as HTMLInputElement | null;

    expect(cityInput?.value).toBe('Warsaw');
  });

  it('should merge external class into the grid container', () => {
    host.options = buildOptions(makeAddressGroup());
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const container = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="address-grid"]',
    );

    expect(container?.className).toContain('extra-user-class');
    expect(container?.className).toContain('smart:grid');
  });
});
