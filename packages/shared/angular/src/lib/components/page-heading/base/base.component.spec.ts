import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeadingBaseComponent } from './base.component';
import { IPageHeadingOptions } from '../../../models';

@Component({
  selector: 'smart-test-page-heading',
  template: '',
})
class TestPageHeadingComponent extends PageHeadingBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-page-heading
    [options]="options"
    [class]="cssClass"
  />`,
  imports: [TestPageHeadingComponent],
})
class TestHostComponent {
  options: IPageHeadingOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: PageHeadingBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestPageHeadingComponent;

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
    expect(directive).toBeInstanceOf(PageHeadingBaseComponent);
  });

  it('should have smartType static equal to "page-heading"', () => {
    expect(PageHeadingBaseComponent.smartType).toBe('page-heading');
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

  it('should accept IPageHeadingOptions via options input', async () => {
    host.options = { title: 'Back End Developer', subtitle: 'Engineering' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      title: 'Back End Developer',
      subtitle: 'Engineering',
    });
  });
});
