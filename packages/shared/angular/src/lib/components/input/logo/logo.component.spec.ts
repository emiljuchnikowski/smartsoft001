import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { InputLogoComponent } from './logo.component';
import { InputOptions } from '../../../models';
import { IModelLabelProvider } from '../../../providers';

@Model({})
class LogoModel {
  @Field({ type: FieldType.logo })
  logo = '';
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-input-logo
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-logo>
  `,
  imports: [InputLogoComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(control: UntypedFormControl): InputOptions<LogoModel> {
  new UntypedFormGroup({ logo: control });
  return {
    control,
    fieldKey: 'logo',
    model: new LogoModel(),
    treeLevel: 0,
  };
}

describe('@smartsoft001/shared-angular: InputLogoComponent', () => {
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

  it('should render chooser button when control has no value', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button).toBeTruthy();
  });

  it('should render image preview when control has value', () => {
    const control = new UntypedFormControl('data:image/jpeg;base64,AAA');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');

    expect(img).toBeTruthy();
  });

  it('should render label with model label text', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');

    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Mock Label');
  });

  it('should render required asterisk when control is required', () => {
    const control = new UntypedFormControl('', Validators.required);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = fixture.nativeElement.querySelector('label span');

    expect(asterisk).toBeTruthy();
    expect(asterisk.textContent).toContain('*');
  });

  it('should merge external class into the group container', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector(
      'label + div',
    ) as HTMLElement;

    expect(container.className).toContain('extra-user-class');
  });
});
