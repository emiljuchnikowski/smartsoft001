import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInFormBaseComponent } from './base.component';
import { ISignInFormOptions, SmartSignInFormMode } from '../../../models';

@Component({
  selector: 'smart-test-sign-in-form',
  template: '',
})
class TestSignInFormComponent extends SignInFormBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-sign-in-form
    [mode]="mode"
    [disabled]="disabled"
    [options]="options"
    [class]="cssClass"
  />`,
  imports: [TestSignInFormComponent],
})
class TestHostComponent {
  mode: SmartSignInFormMode = 'sign-in';
  disabled = false;
  options: ISignInFormOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: SignInFormBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestSignInFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    directive = fixture.debugElement.children[0].componentInstance;
  });

  it('should create an instance when extended', () => {
    expect(directive).toBeInstanceOf(SignInFormBaseComponent);
  });

  it('should have smartType static equal to "sign-in-form"', () => {
    expect(SignInFormBaseComponent.smartType).toBe('sign-in-form');
  });

  it('should default mode to "sign-in"', () => {
    expect(directive.mode()).toBe('sign-in');
  });

  it('should default disabled to false', () => {
    expect(directive.disabled()).toBe(false);
  });

  it('should default options to undefined', () => {
    expect(directive.options()).toBeUndefined();
  });

  it('should default cssClass to empty string', () => {
    expect(directive.cssClass()).toBe('');
  });

  it('should accept "sign-up" mode', async () => {
    host.mode = 'sign-up';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.mode()).toBe('sign-up');
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'my-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('my-class');
  });

  it('should expose submit and socialClick OutputEmitterRef instances', () => {
    expect(directive.submit).toBeTruthy();
    expect(directive.socialClick).toBeTruthy();
  });
});
