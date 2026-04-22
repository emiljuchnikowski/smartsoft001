import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { Field, Model } from '@smartsoft001/models';

import { FormStandardComponent } from './standard.component';
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

@Component({
  selector: 'smart-test-host',
  template: `<smart-form-standard
    [options]="options"
    [form]="form"
    [class]="cssClass"
  ></smart-form-standard>`,
  imports: [FormStandardComponent],
})
class TestHostComponent {
  form = new UntypedFormGroup({
    firstName: new UntypedFormControl(''),
    lastName: new UntypedFormControl(''),
  });
  options: IFormOptions<TestItemModel> = {
    model: new TestItemModel(),
    show: true,
  };
  cssClass = '';
}

describe('@smartsoft001/shared-angular: FormStandardComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let standard: FormStandardComponent<TestItemModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    })
      .overrideComponent(FormStandardComponent, {
        remove: { imports: [InputComponent] },
        add: { imports: [MockInputComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    standard = fixture.debugElement.children[0].componentInstance;
  });

  it('should render one <smart-input> per form control', () => {
    const inputs = fixture.nativeElement.querySelectorAll('smart-input');

    expect(inputs.length).toBe(2);
  });

  it('should apply container classes including divider styles', () => {
    const classes = standard.containerClasses();

    expect(classes).toContain('smart:divide-y');
    expect(classes).toContain('dark:smart:divide-white/10');
  });

  it('should append cssClass input to containerClasses()', async () => {
    fixture.componentInstance.cssClass = 'my-extra-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(standard.containerClasses()).toContain('my-extra-class');
  });

  it('should skip fields where __smartDisabled is set on the control', () => {
    const host = fixture.componentInstance;
    (host.form.controls['firstName'] as any)['__smartDisabled'] = true;
    host.form = new UntypedFormGroup({
      firstName: host.form.controls['firstName'],
      lastName: host.form.controls['lastName'],
    });
    (host.form.controls['firstName'] as any)['__smartDisabled'] = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    const inputs = fixture.nativeElement.querySelectorAll('smart-input');

    expect(inputs.length).toBe(1);
  });
});
