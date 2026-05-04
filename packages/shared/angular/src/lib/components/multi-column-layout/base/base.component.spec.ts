import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiColumnLayoutBaseComponent } from './base.component';
import { IMultiColumnLayoutOptions } from '../../../models';

@Component({
  selector: 'smart-test-multi-column-layout',
  template: '',
})
class TestMultiColumnLayoutComponent extends MultiColumnLayoutBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-multi-column-layout
    [options]="options"
    [class]="cssClass"
  />`,
  imports: [TestMultiColumnLayoutComponent],
})
class TestHostComponent {
  options: IMultiColumnLayoutOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: MultiColumnLayoutBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestMultiColumnLayoutComponent;

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
    expect(directive).toBeInstanceOf(MultiColumnLayoutBaseComponent);
  });

  it('should have smartType static equal to "multi-column-layout"', () => {
    expect(MultiColumnLayoutBaseComponent.smartType).toBe(
      'multi-column-layout',
    );
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

  it('should accept IMultiColumnLayoutOptions via options input', async () => {
    host.options = { title: 'Inbox', width: 'constrained' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      title: 'Inbox',
      width: 'constrained',
    });
  });
});
