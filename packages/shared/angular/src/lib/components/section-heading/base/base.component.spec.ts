import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionHeadingBaseComponent } from './base.component';
import { ISectionHeadingOptions } from '../../../models';

@Component({
  selector: 'smart-test-section-heading',
  template: '',
})
class TestSectionHeadingComponent extends SectionHeadingBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-section-heading
    [options]="options"
    [class]="cssClass"
  />`,
  imports: [TestSectionHeadingComponent],
})
class TestHostComponent {
  options: ISectionHeadingOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: SectionHeadingBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestSectionHeadingComponent;

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
    expect(directive).toBeInstanceOf(SectionHeadingBaseComponent);
  });

  it('should have smartType static equal to "section-heading"', () => {
    expect(SectionHeadingBaseComponent.smartType).toBe('section-heading');
  });

  it('should default options to undefined', () => {
    expect(directive.options()).toBeUndefined();
  });

  it('should default cssClass to empty string', () => {
    expect(directive.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'my-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('my-class');
  });

  it('should accept ISectionHeadingOptions via options input', async () => {
    host.options = { title: 'Applicants', label: 'in Engineering' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      title: 'Applicants',
      label: 'in Engineering',
    });
  });
});
