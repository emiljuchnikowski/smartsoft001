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

import { InputLongTextComponent } from './long-text.component';
import { InputOptions } from '../../../models';
import { IModelLabelProvider } from '../../../providers';
import { HardwareService } from '../../../services';

@Model({})
class LongTextModel {
  @Field({ type: FieldType.longText })
  description = '';
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-input-long-text
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-long-text>
  `,
  imports: [InputLongTextComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(
  control: UntypedFormControl,
): InputOptions<LongTextModel> {
  new UntypedFormGroup({ description: control });
  return {
    control,
    fieldKey: 'description',
    model: new LongTextModel(),
    treeLevel: 0,
  };
}

describe('@smartsoft001/shared-angular: InputLongTextComponent', () => {
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
        HardwareService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render ngx-editor-menu when control is present', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('ngx-editor-menu');

    expect(menu).toBeTruthy();
  });

  it('should render ngx-editor when control is present', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const editor = fixture.nativeElement.querySelector('ngx-editor');

    expect(editor).toBeTruthy();
  });

  it('should render label with model label text', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');

    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Mock Label');
  });

  it('should render required asterisk when control has Validators.required', () => {
    const control = new UntypedFormControl('', Validators.required);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = fixture.nativeElement.querySelector('label span');

    expect(asterisk).toBeTruthy();
    expect(asterisk.textContent).toContain('*');
  });

  it('should merge external class input into the editor wrapper class attribute', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const wrapper =
      fixture.nativeElement.querySelector('ngx-editor-menu').parentElement;

    expect(wrapper.className).toContain('extra-user-class');
  });

  it('should destroy editor on ngOnDestroy', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const childDebugEl = fixture.debugElement.children[0];
    const instance =
      childDebugEl.componentInstance as InputLongTextComponent<LongTextModel>;
    const destroySpy = jest.spyOn(instance.editor, 'destroy');

    fixture.destroy();

    expect(destroySpy).toHaveBeenCalled();
  });
});
