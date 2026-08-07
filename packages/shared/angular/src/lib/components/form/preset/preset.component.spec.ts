import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { Field, Model } from '@smartsoft001/models';

import { FormPresetComponent } from './preset.component';
import { IFormOptions } from '../../../models';
import { InputComponent } from '../../input';

@Component({
  selector: 'smart-input',
  template: '<span class="mock-input">mock</span>',
})
class MockInputComponent {
  options = input<unknown>();
}

@Model({})
class TestItemModel {
  @Field({})
  firstName = '';

  @Field({})
  lastName = '';
}

describe('@smartsoft001/shared-angular: FormPresetComponent', () => {
  let fixture: ComponentFixture<FormPresetComponent<TestItemModel>>;
  let component: FormPresetComponent<TestItemModel>;
  let form: UntypedFormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPresetComponent],
    })
      .overrideComponent(FormPresetComponent, {
        remove: { imports: [InputComponent] },
        add: { imports: [MockInputComponent] },
      })
      .compileComponents();

    form = new UntypedFormGroup({
      firstName: new UntypedFormControl(''),
      lastName: new UntypedFormControl(''),
    });

    fixture =
      TestBed.createComponent<FormPresetComponent<TestItemModel>>(
        FormPresetComponent,
      );
    const options: IFormOptions<TestItemModel> = {
      model: new TestItemModel(),
      show: true,
    };
    fixture.componentRef.setInput('options', options);
    fixture.componentRef.setInput('form', form);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('rendering', () => {
    it('should render a single form shell marked with data-role="form"', () => {
      const shells = (fixture.nativeElement as HTMLElement).querySelectorAll(
        '[data-role="form"]',
      );

      expect(shells.length).toBe(1);
    });

    it('should render one data-role="field" wrapper per form control', () => {
      const fields = (fixture.nativeElement as HTMLElement).querySelectorAll(
        '[data-role="field"]',
      );

      expect(fields.length).toBe(2);
    });

    it('should expose the field key on each field wrapper via data-key', () => {
      const fields = (fixture.nativeElement as HTMLElement).querySelectorAll(
        '[data-role="field"]',
      );
      const keys = Array.from(fields).map((el) => el.getAttribute('data-key'));

      expect(keys).toEqual(['firstName', 'lastName']);
    });

    it('should render one <smart-input> per rendered field', () => {
      const inputs = (fixture.nativeElement as HTMLElement).querySelectorAll(
        'smart-input',
      );

      expect(inputs.length).toBe(2);
    });

    it('should apply spaced shell classes on the form root', () => {
      const shell = (fixture.nativeElement as HTMLElement).querySelector(
        '[data-role="form"]',
      );

      expect(shell?.className).toContain('smart:space-y-5');
    });
  });

  describe('class alias', () => {
    it('should land the inherited "class" alias on the form root', () => {
      fixture.componentRef.setInput('class', 'my-extra-class');
      fixture.detectChanges();

      const shell = (fixture.nativeElement as HTMLElement).querySelector(
        '[data-role="form"]',
      );

      expect(shell?.className).toContain('my-extra-class');
    });
  });

  describe('outputs', () => {
    it('should emit the form value through invokeSubmit on submit()', () => {
      form.controls['firstName'].setValue('Ada');
      let emitted: unknown;
      component.invokeSubmit.subscribe((value: unknown) => (emitted = value));

      component.submit();

      expect(emitted).toEqual({ firstName: 'Ada', lastName: '' });
    });
  });
});
