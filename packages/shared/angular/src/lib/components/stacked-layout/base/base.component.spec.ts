import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedLayoutBaseComponent } from './base.component';
import { IStackedLayoutOptions } from '../../../models';

@Component({
  selector: 'smart-test-stacked-layout',
  template: '',
})
class TestStackedLayoutComponent extends StackedLayoutBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-stacked-layout
    [options]="options"
    [class]="cssClass"
  />`,
  imports: [TestStackedLayoutComponent],
})
class TestHostComponent {
  options: IStackedLayoutOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: StackedLayoutBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestStackedLayoutComponent;

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
    expect(directive).toBeInstanceOf(StackedLayoutBaseComponent);
  });

  it('should have smartType static equal to "stacked-layout"', () => {
    expect(StackedLayoutBaseComponent.smartType).toBe('stacked-layout');
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

  it('should accept IStackedLayoutOptions via options input', async () => {
    host.options = { title: 'Dashboard', containerWidth: 'lg' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      title: 'Dashboard',
      containerWidth: 'lg',
    });
  });
});
