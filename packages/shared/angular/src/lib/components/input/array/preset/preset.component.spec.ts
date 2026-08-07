import { Component, Input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicComponentInjectorToken } from 'ng-dynamic-component';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { InputArrayPresetComponent } from './preset.component';
import { FormFactory } from '../../../../factories';
import { InputOptions } from '../../../../models';
import { IModelLabelProvider } from '../../../../providers';
import { FORM_COMPONENT_TOKEN } from '../../../../shared.inectors';

@Component({
  selector: 'smart-stub-form',
  template: `<div data-role="stub-form">stub-form</div>`,
})
class StubFormComponent {
  @Input() options: any;
}

@Model({})
class ArrayChildModel {
  @Field({ type: FieldType.text })
  name = '';
}

@Model({})
class ArrayParentModel {
  @Field({ type: FieldType.array, classType: ArrayChildModel })
  items: ArrayChildModel[] = [];
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-input-array-preset
      [options]="options"
      [fieldOptions]="fieldOptions"
    ></smart-input-array-preset>
  `,
  imports: [InputArrayPresetComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
}

function createItemControl(name: string): UntypedFormGroup {
  return new UntypedFormGroup({ name: new UntypedFormControl(name) });
}

function buildOptions(
  control: UntypedFormArray,
): InputOptions<ArrayParentModel> {
  new UntypedFormGroup({ items: control });
  return {
    control,
    fieldKey: 'items',
    model: new ArrayParentModel(),
    treeLevel: 0,
  };
}

/** Zoneless env: no fakeAsync, so drain microtasks + the base setTimeout. */
async function flush(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve));
  await new Promise((resolve) => setTimeout(resolve));
}

describe('@smartsoft001/shared-angular: InputArrayPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        StubFormComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
        { provide: FORM_COMPONENT_TOKEN, useValue: StubFormComponent },
        // ng-dynamic-component's IoService needs this token; a null componentRef
        // is a safe no-op stub for the isolated component test.
        {
          provide: DynamicComponentInjectorToken,
          useValue: { componentRef: null },
        },
        {
          provide: FormFactory,
          useValue: {
            create: jest
              .fn()
              .mockImplementation(async () => createItemControl('')),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render a card per array item', () => {
    const control = new UntypedFormArray([
      createItemControl('a'),
      createItemControl('b'),
    ]);
    host.options = buildOptions(control);
    host.fieldOptions = { classType: ArrayChildModel };
    fixture.detectChanges();

    const items = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-role="item"]',
    );

    expect(items.length).toBe(2);
  });

  it('should render the nested form component inside every item', () => {
    const control = new UntypedFormArray([
      createItemControl('a'),
      createItemControl('b'),
    ]);
    host.options = buildOptions(control);
    host.fieldOptions = { classType: ArrayChildModel };
    fixture.detectChanges();

    const forms = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-role="stub-form"]',
    );

    expect(forms.length).toBe(2);
  });

  it('should apply the Preline card classes to every item', () => {
    const control = new UntypedFormArray([createItemControl('a')]);
    host.options = buildOptions(control);
    host.fieldOptions = { classType: ArrayChildModel };
    fixture.detectChanges();

    const item = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="item"]',
    );

    expect(item?.className).toContain('smart:rounded-lg');
    expect(item?.className).toContain('smart:border-gray-200');
    expect(item?.className).toContain('smart:bg-white');
    expect(item?.className).toContain('smart:p-3');
    expect(item?.className).toContain('smart:dark:bg-gray-800');
  });

  it('should stack the items in the array wrapper', () => {
    const control = new UntypedFormArray([createItemControl('a')]);
    host.options = buildOptions(control);
    host.fieldOptions = { classType: ArrayChildModel };
    fixture.detectChanges();

    const wrapper = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="array"]',
    );

    expect(wrapper?.className).toContain('smart:space-y-2');
  });

  it('should add an item through the base add logic when the add button is clicked', async () => {
    const control = new UntypedFormArray([createItemControl('a')]);
    host.options = buildOptions(control);
    host.fieldOptions = { classType: ArrayChildModel };
    fixture.detectChanges();

    const addButton = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="add"]',
    ) as HTMLButtonElement;
    addButton.click();
    await flush();
    fixture.detectChanges();

    expect(control.length).toBe(2);
    expect(
      (fixture.nativeElement as HTMLElement).querySelectorAll(
        '[data-role="item"]',
      ).length,
    ).toBe(2);
  });

  it('should remove an item through the base remove logic when the remove button is clicked', () => {
    const control = new UntypedFormArray([
      createItemControl('a'),
      createItemControl('b'),
    ]);
    host.options = buildOptions(control);
    host.fieldOptions = { classType: ArrayChildModel };
    fixture.detectChanges();

    const removeButton = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="remove"]',
    ) as HTMLButtonElement;
    removeButton.click();
    fixture.detectChanges();

    expect(control.length).toBe(1);
    expect(control.value).toEqual([{ name: 'b' }]);
  });

  it('should render an empty state when the array has no items', () => {
    const control = new UntypedFormArray([]);
    host.options = buildOptions(control);
    host.fieldOptions = { classType: ArrayChildModel };
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.querySelector('[data-role="empty"]')).toBeTruthy();
    expect(nativeElement.querySelectorAll('[data-role="item"]').length).toBe(0);
  });

  it('should hide the add and remove buttons when possibilities are static', () => {
    const control = new UntypedFormArray([createItemControl('a')]);
    host.options = buildOptions(control);
    host.fieldOptions = {
      classType: ArrayChildModel,
      possibilities: { static: true },
    };
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.querySelector('[data-role="add"]')).toBeFalsy();
    expect(nativeElement.querySelector('[data-role="remove"]')).toBeFalsy();
  });
});
