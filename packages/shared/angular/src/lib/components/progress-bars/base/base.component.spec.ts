import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarsBaseComponent } from './base.component';
import { IProgressBarsOptions } from '../../../models';

@Component({
  selector: 'smart-test-progress-bars',
  template: '',
})
class TestProgressBarsComponent extends ProgressBarsBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-progress-bars
    [options]="options"
    [class]="cssClass"
  />`,
  imports: [TestProgressBarsComponent],
})
class TestHostComponent {
  options: IProgressBarsOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: ProgressBarsBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestProgressBarsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    directive = fixture.debugElement.children[0].componentInstance;
  });

  it('should create instance', () => {
    expect(directive).toBeInstanceOf(ProgressBarsBaseComponent);
  });

  it('should have smartType = "progress-bars"', () => {
    expect(ProgressBarsBaseComponent.smartType).toBe('progress-bars');
  });

  it('should default options/class', () => {
    expect(directive.options()).toBeUndefined();
    expect(directive.cssClass()).toBe('');
  });

  it('should accept options', async () => {
    host.options = { steps: [{ id: 's1', name: 'Step 1' }] };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()?.steps?.length).toBe(1);
  });

  it('should expose stepClick output', () => {
    expect(directive.stepClick).toBeTruthy();
  });
});
