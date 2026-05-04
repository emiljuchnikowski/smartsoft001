import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { InputOptions } from '../../models';
import { IModelLabelProvider } from '../../providers';
import { StyleService } from '../../services';
import { INPUT_FIELD_COMPONENTS_TOKEN } from '../../shared.inectors';
import { InputBaseComponent } from './base/base.component';
import { InputComponent } from './input.component';

@Component({
  selector: 'smart-test-input-injected',
  template: '<div class="injected-input">injected</div>',
})
class MockInjectedComponent extends InputBaseComponent<any> {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

@Model({})
class TextModel {
  @Field({ type: FieldType.text })
  name = '';
}

@Model({})
class EmailModel {
  @Field({ type: FieldType.email })
  email = '';
}

@Model({})
class FlagModel {
  @Field({ type: FieldType.flag })
  active = false;
}

function createOptions<T>(
  model: T,
  fieldKey: string,
  control: UntypedFormControl,
): InputOptions<T> {
  return {
    control,
    fieldKey,
    model,
    treeLevel: 0,
  };
}

const styleServiceMock = { init: jest.fn() };

describe('@smartsoft001/shared-angular: InputComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<InputComponent<any>>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          InputComponent,
          ReactiveFormsModule,
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
          { provide: StyleService, useValue: styleServiceMock },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(InputComponent);
    });

    it('should render <smart-input-text> for FieldType.text', () => {
      const model = new TextModel();
      const control = new UntypedFormControl('');

      fixture.componentRef.setInput(
        'options',
        createOptions(model, 'name', control),
      );
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector('smart-input-text');

      expect(el).toBeTruthy();
    });

    it('should render <smart-input-email> for FieldType.email', () => {
      const model = new EmailModel();
      const control = new UntypedFormControl('');

      fixture.componentRef.setInput(
        'options',
        createOptions(model, 'email', control),
      );
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector('smart-input-email');

      expect(el).toBeTruthy();
    });

    it('should render <smart-input-flag> for FieldType.flag', () => {
      const model = new FlagModel();
      const control = new UntypedFormControl(false);

      fixture.componentRef.setInput(
        'options',
        createOptions(model, 'active', control),
      );
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector('smart-input-flag');

      expect(el).toBeTruthy();
    });
  });

  describe('with INPUT_FIELD_COMPONENTS_TOKEN override', () => {
    let fixture: ComponentFixture<InputComponent<any>>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          InputComponent,
          MockInjectedComponent,
          ReactiveFormsModule,
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
          { provide: StyleService, useValue: styleServiceMock },
          {
            provide: INPUT_FIELD_COMPONENTS_TOKEN,
            useValue: { [FieldType.text]: MockInjectedComponent },
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(InputComponent);
    });

    it('should render injected component for FieldType.text instead of InputTextComponent', () => {
      const model = new TextModel();
      const control = new UntypedFormControl('');

      fixture.componentRef.setInput(
        'options',
        createOptions(model, 'name', control),
      );
      fixture.detectChanges();

      const injected = fixture.nativeElement.querySelector('.injected-input');
      const defaultText =
        fixture.nativeElement.querySelector('smart-input-text');

      expect(injected).toBeTruthy();
      expect(defaultText).toBeFalsy();
    });
  });

  describe('error rendering', () => {
    let fixture: ComponentFixture<InputComponent<any>>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          InputComponent,
          ReactiveFormsModule,
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
          { provide: StyleService, useValue: styleServiceMock },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(InputComponent);
    });

    it('should render <smart-input-error> when control is invalid and touched', () => {
      const model = new TextModel();
      const control = new UntypedFormControl('', Validators.required);
      control.markAsTouched();

      fixture.componentRef.setInput(
        'options',
        createOptions(model, 'name', control),
      );
      fixture.detectChanges();

      const errorEl = fixture.nativeElement.querySelector('smart-input-error');

      expect(errorEl).toBeTruthy();
    });
  });
});
