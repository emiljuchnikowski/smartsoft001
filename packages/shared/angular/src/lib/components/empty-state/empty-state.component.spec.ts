import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStateBaseComponent } from './base/base.component';
import { EmptyStateComponent } from './empty-state.component';
import { EMPTY_STATE_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-empty-state-injected',
  template: '<div class="injected-empty-state">injected</div>',
})
class MockInjectedComponent extends EmptyStateBaseComponent {
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: EmptyStateComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<EmptyStateComponent>;
    let component: EmptyStateComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [EmptyStateComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(EmptyStateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-empty-state-standard by default', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-empty-state-standard',
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

  describe('with EMPTY_STATE_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<EmptyStateComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [EmptyStateComponent, MockInjectedComponent],
        providers: [
          {
            provide: EMPTY_STATE_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(EmptyStateComponent);
      fixture.detectChanges();
    });

    it('should render injected component when token provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-empty-state',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-empty-state-standard when token provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-empty-state-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
