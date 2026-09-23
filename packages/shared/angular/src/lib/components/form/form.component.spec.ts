import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { Field, Model } from '@smartsoft001/models';

import { FormBaseComponent } from './base/base.component';
import { FormComponent } from './form.component';
import { FormStandardComponent } from './standard/standard.component';
import { FormFactory } from '../../factories';
import { IFormOptions } from '../../models';
import { SmartFormGroup } from '../../services';
import { FORM_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { InputComponent } from '../input';

@Component({
  selector: 'smart-input',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<span class="mock-input">mock</span>',
})
class MockInputComponent {
  options = input<unknown>();
}

@Component({
  selector: 'smart-test-custom-form',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<div class="custom-form">custom</div>',
})
class TestCustomFormComponent extends FormBaseComponent<any> {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

@Model({})
class TestModel {
  @Field({}) firstName = '';
  @Field({ required: true }) lastName = '';
}

const buildControlGroup = () =>
  new UntypedFormGroup({
    firstName: new UntypedFormControl(''),
    lastName: new UntypedFormControl(''),
  });

const buildOptions = (): IFormOptions<TestModel> => ({
  model: new TestModel(),
  show: true,
  control: buildControlGroup() as any,
});

// Stub FormFactory so TestBed does not need to wire UntypedFormBuilder/AuthService/etc.
// The spec intentionally uses the `options.control` path (synchronous branch in the effect)
// so FormFactory.create() is never called; the stub just satisfies DI.
class StubFormFactory {
  create() {
    return Promise.resolve(new UntypedFormGroup({}));
  }
}

/**
 * Builds a brand new group per call and hands back a promise the spec
 * resolves by hand, so a build can be settled out of the order it started in.
 */
class DeferredFormFactory {
  readonly groups: SmartFormGroup[] = [];
  private readonly resolvers: Array<() => void> = [];

  create = jest.fn(() => {
    const group = SmartFormGroup.create();
    group.addControl('firstName', new UntypedFormControl(''));
    group.addControl('lastName', new UntypedFormControl(''));
    this.groups.push(group);

    return new Promise<SmartFormGroup>((resolve) => {
      this.resolvers.push(() => resolve(group));
    });
  });

  resolveBuild(index: number): void {
    this.resolvers[index]();
  }
}

// No `control`, so the effect goes through FormFactory.create().
const buildFactoryOptions = (): IFormOptions<TestModel> => ({
  model: new TestModel(),
  show: true,
});

describe('@smartsoft001/shared-angular: FormComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<FormComponent<TestModel>>;
    let component: FormComponent<TestModel>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormComponent],
        providers: [{ provide: FormFactory, useClass: StubFormFactory }],
      })
        .overrideComponent(FormStandardComponent, {
          remove: { imports: [InputComponent] },
          add: { imports: [MockInputComponent] },
        })
        .compileComponents();

      fixture = TestBed.createComponent(FormComponent<TestModel>);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('options', buildOptions());
      fixture.detectChanges();
    });

    it('should render smart-form-standard inside a form element by default', () => {
      const formEl = fixture.nativeElement.querySelector('form');
      const standard = fixture.nativeElement.querySelector(
        'smart-form-standard',
      );

      expect(formEl).toBeTruthy();
      expect(standard).toBeTruthy();
    });

    it('should forward options to component.options()', () => {
      const opts = buildOptions();
      fixture.componentRef.setInput('options', opts);
      fixture.detectChanges();

      expect(component.options()).toBe(opts);
    });

    it('should expose cssClass via class alias', () => {
      fixture.componentRef.setInput('class', 'my-extra');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('my-extra');
    });

    it('should emit invokeSubmit when the <form> element fires submit', () => {
      const handler = jest.fn();
      component.invokeSubmit.subscribe(handler);

      const formEl = fixture.nativeElement.querySelector(
        'form',
      ) as HTMLFormElement;
      formEl.dispatchEvent(new Event('submit'));

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('with FORM_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<FormComponent<TestModel>>;
    let component: FormComponent<TestModel>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormComponent, TestCustomFormComponent],
        providers: [
          { provide: FormFactory, useClass: StubFormFactory },
          {
            provide: FORM_STANDARD_COMPONENT_TOKEN,
            useValue: TestCustomFormComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FormComponent<TestModel>);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('options', buildOptions());
      fixture.componentRef.setInput('class', 'my-extra');
      fixture.detectChanges();
    });

    it('should render injected custom form component', () => {
      const custom = fixture.nativeElement.querySelector('.custom-form');
      const standard = fixture.nativeElement.querySelector(
        'smart-form-standard',
      );

      expect(custom).toBeTruthy();
      expect(standard).toBeFalsy();
    });

    it('should expose componentInputs with options, form and class keys', () => {
      const inputs = component.componentInputs();

      expect(Object.keys(inputs)).toEqual(
        expect.arrayContaining(['options', 'form', 'class']),
      );
      expect(inputs['class']).toBe('my-extra');
    });
  });

  describe('rebuilding the group when options change', () => {
    let fixture: ComponentFixture<FormComponent<TestModel>>;
    let component: FormComponent<TestModel>;
    let factory: DeferredFormFactory;

    beforeEach(async () => {
      factory = new DeferredFormFactory();

      await TestBed.configureTestingModule({
        imports: [FormComponent, TestCustomFormComponent],
        providers: [
          { provide: FormFactory, useValue: factory },
          {
            provide: FORM_STANDARD_COMPONENT_TOKEN,
            useValue: TestCustomFormComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FormComponent<TestModel>);
      component = fixture.componentInstance;
    });

    /** Lets the pending `FormFactory.create` promise callbacks run. */
    async function settle(): Promise<void> {
      await new Promise((resolve) => setTimeout(resolve));
      fixture.detectChanges();
    }

    function renderedBody(): TestCustomFormComponent {
      const body = fixture.debugElement.query(
        By.directive(TestCustomFormComponent),
      );

      if (!body) throw new Error('no form body rendered');

      return body.componentInstance as TestCustomFormComponent;
    }

    it('should render the group built for the latest options', async () => {
      fixture.componentRef.setInput('options', buildFactoryOptions());
      fixture.detectChanges();
      factory.resolveBuild(0);
      await settle();

      fixture.componentRef.setInput('options', buildFactoryOptions());
      fixture.detectChanges();
      factory.resolveBuild(1);
      await settle();

      expect(renderedBody().form()).toBe(component.form);
    });

    it('should keep the latest group when an earlier build settles last', async () => {
      fixture.componentRef.setInput('options', buildFactoryOptions());
      fixture.detectChanges();
      fixture.componentRef.setInput('options', buildFactoryOptions());
      fixture.detectChanges();

      factory.resolveBuild(1);
      await settle();
      factory.resolveBuild(0);
      await settle();

      expect(component.form).toBe(factory.groups[1]);
      expect(renderedBody().form()).toBe(factory.groups[1]);
    });

    it('should emit valueChange for the rendered group only', async () => {
      fixture.componentRef.setInput('options', buildFactoryOptions());
      fixture.detectChanges();
      factory.resolveBuild(0);
      await settle();

      fixture.componentRef.setInput('options', buildFactoryOptions());
      fixture.detectChanges();
      factory.resolveBuild(1);
      await settle();

      const emitted: TestModel[] = [];
      component.valueChange.subscribe((val) => emitted.push(val));

      factory.groups[0].controls['firstName'].setValue('stale');
      component.form?.controls['firstName'].setValue('current');

      expect(emitted).toEqual([
        expect.objectContaining({ firstName: 'current' }),
      ]);
    });
  });
});
