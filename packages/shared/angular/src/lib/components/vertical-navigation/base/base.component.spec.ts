import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalNavigationBaseComponent } from './base.component';
import { IVerticalNavOptions } from '../../../models';

@Component({
  selector: 'smart-test-vnav',
  template: '',
})
class TestVNavComponent extends VerticalNavigationBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-vnav [options]="options" [class]="cssClass" />`,
  imports: [TestVNavComponent],
})
class TestHostComponent {
  options: IVerticalNavOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: VerticalNavigationBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestVNavComponent;

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
    expect(directive).toBeInstanceOf(VerticalNavigationBaseComponent);
  });

  it('should have smartType = "vertical-navigation"', () => {
    expect(VerticalNavigationBaseComponent.smartType).toBe(
      'vertical-navigation',
    );
  });

  it('should default options/class', () => {
    expect(directive.options()).toBeUndefined();
    expect(directive.cssClass()).toBe('');
  });

  it('should accept options', async () => {
    host.options = { items: [{ id: 'a', label: 'A' }] };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()?.items?.length).toBe(1);
  });

  it('should expose itemClick output', () => {
    expect(directive.itemClick).toBeTruthy();
  });
});
