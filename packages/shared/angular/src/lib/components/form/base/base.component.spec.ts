import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { Field, Model } from '@smartsoft001/models';

import { FormBaseComponent } from './base.component';
import { IFormOptions } from '../../../models';

@Model({})
class TestItemModel {
  @Field({})
  firstName = '';

  @Field({})
  lastName = '';
}

@Component({
  selector: 'smart-test-form',
  template: '',
})
class TestFormComponent extends FormBaseComponent<TestItemModel> {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-form
    [options]="options"
    [form]="form"
    [class]="cssClass"
    (invokeSubmit)="onSubmit($event)"
  />`,
  imports: [TestFormComponent],
})
class TestHostComponent {
  form = new UntypedFormGroup({
    firstName: new UntypedFormControl('Ann'),
    lastName: new UntypedFormControl('Smith'),
  });
  options: IFormOptions<TestItemModel> = {
    model: new TestItemModel(),
    show: true,
  };
  cssClass = '';
  lastSubmit: any = null;
  onSubmit(val: any) {
    this.lastSubmit = val;
  }
}

describe('@smartsoft001/shared-angular: FormBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let formComponent: TestFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    formComponent = fixture.debugElement.children[0].componentInstance;
  });

  it('should create an instance when extended', () => {
    expect(formComponent).toBeInstanceOf(FormBaseComponent);
  });

  it('should default cssClass to empty string', () => {
    expect(formComponent.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    fixture.componentInstance.cssClass = 'my-custom-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(formComponent.cssClass()).toBe('my-custom-class');
  });

  it('should populate fields from form controls after form input is set', () => {
    expect(formComponent.fields).toEqual(['firstName', 'lastName']);
  });

  it('should emit invokeSubmit with form value on submit()', () => {
    formComponent.submit();

    expect(fixture.componentInstance.lastSubmit).toEqual({
      firstName: 'Ann',
      lastName: 'Smith',
    });
  });
});
