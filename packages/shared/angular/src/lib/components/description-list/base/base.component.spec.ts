import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionListBaseComponent } from './base.component';
import { IDescriptionListOptions } from '../../../models';

@Component({
  selector: 'smart-test-description-list',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '',
})
class TestDescriptionListComponent extends DescriptionListBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-description-list
    [options]="options"
    [class]="cssClass"
  />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TestDescriptionListComponent],
})
class TestHostComponent {
  options: IDescriptionListOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DescriptionListBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestDescriptionListComponent;

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
    expect(directive).toBeInstanceOf(DescriptionListBaseComponent);
  });

  it('should have smartType static equal to "description-list"', () => {
    expect(DescriptionListBaseComponent.smartType).toBe('description-list');
  });

  it('should default options to undefined', () => {
    expect(directive.options()).toBeUndefined();
  });

  it('should default cssClass to empty string', () => {
    expect(directive.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'my-class';
    fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('my-class');
  });

  it('should accept IDescriptionListOptions via options input', async () => {
    host.options = {
      title: 'Applicant Information',
      description: 'Personal details and application.',
      items: [{ label: 'Full name', value: 'Margot Foster' }],
    };
    fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      title: 'Applicant Information',
      description: 'Personal details and application.',
      items: [{ label: 'Full name', value: 'Margot Foster' }],
    });
  });
});
