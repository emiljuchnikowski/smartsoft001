import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPanelComponent } from './action-panel.component';
import { ActionPanelBaseComponent } from './base/base.component';
import { ACTION_PANEL_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-action-panel-injected',
  template: '<div class="injected-action-panel">injected</div>',
})
class MockInjectedComponent extends ActionPanelBaseComponent {
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: ActionPanelComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<ActionPanelComponent>;
    let component: ActionPanelComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ActionPanelComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ActionPanelComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-action-panel-standard by default', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-action-panel-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate options/class', () => {
      fixture.componentRef.setInput('options', { title: 'Hello' });
      fixture.componentRef.setInput('class', 'wrap');
      fixture.detectChanges();

      expect(component.options()).toEqual({ title: 'Hello' });
      expect(component.cssClass()).toBe('wrap');
    });
  });

  describe('with ACTION_PANEL_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<ActionPanelComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ActionPanelComponent, MockInjectedComponent],
        providers: [
          {
            provide: ACTION_PANEL_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ActionPanelComponent);
      fixture.detectChanges();
    });

    it('should render injected component when token provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-action-panel',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-action-panel-standard when token provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-action-panel-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
