import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbsBaseComponent } from './base.component';
import { IBreadcrumbsOptions } from '../../../models';

@Component({
  selector: 'smart-test-breadcrumbs',
  template: '',
})
class TestBreadcrumbsComponent extends BreadcrumbsBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-breadcrumbs [options]="options" [class]="cssClass" />`,
  imports: [TestBreadcrumbsComponent],
})
class TestHostComponent {
  options: IBreadcrumbsOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: BreadcrumbsBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestBreadcrumbsComponent;

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
    expect(directive).toBeInstanceOf(BreadcrumbsBaseComponent);
  });

  it('should have smartType = "breadcrumbs"', () => {
    expect(BreadcrumbsBaseComponent.smartType).toBe('breadcrumbs');
  });

  it('should default options/class', () => {
    expect(directive.options()).toBeUndefined();
    expect(directive.cssClass()).toBe('');
  });

  it('should accept options', async () => {
    host.options = { items: [{ id: 'a', label: 'A', href: '/a' }] };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()?.items.length).toBe(1);
  });

  it('should expose itemClick output', () => {
    expect(directive.itemClick).toBeTruthy();
  });
});
