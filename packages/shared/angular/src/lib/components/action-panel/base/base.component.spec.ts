import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPanelBaseComponent } from './base.component';
import { IActionPanelOptions } from '../../../models';

@Component({
  selector: 'smart-test-action-panel',
  template: '',
})
class TestActionPanelComponent extends ActionPanelBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-action-panel
    [options]="options"
    [class]="cssClass"
  />`,
  imports: [TestActionPanelComponent],
})
class TestHostComponent {
  options: IActionPanelOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: ActionPanelBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestActionPanelComponent;

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
    expect(directive).toBeInstanceOf(ActionPanelBaseComponent);
  });

  it('should have smartType = "action-panel"', () => {
    expect(ActionPanelBaseComponent.smartType).toBe('action-panel');
  });

  it('should default options/class', () => {
    expect(directive.options()).toBeUndefined();
    expect(directive.cssClass()).toBe('');
  });

  it('should accept options', async () => {
    host.options = { title: 'Manage subscription' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({ title: 'Manage subscription' });
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'my-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('my-class');
  });

  it('should expose actionClick output', () => {
    expect(directive.actionClick).toBeTruthy();
  });
});
