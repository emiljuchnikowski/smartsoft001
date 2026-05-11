import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividerBaseComponent } from './base/base.component';
import { DividerComponent } from './divider.component';
import { DIVIDER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-divider-injected',
  template: '<div class="injected-divider">injected</div>',
})
class MockInjectedComponent extends DividerBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: DividerComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<DividerComponent>;
    let component: DividerComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DividerComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(DividerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-divider-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-divider-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate label input to standard component', () => {
      fixture.componentRef.setInput('label', 'My label');
      fixture.detectChanges();

      expect(component.label()).toBe('My label');
    });

    it('should propagate title input to standard component', () => {
      fixture.componentRef.setInput('title', 'My title');
      fixture.detectChanges();

      expect(component.title()).toBe('My title');
    });

    it('should propagate iconName input to standard component', () => {
      fixture.componentRef.setInput('iconName', 'star');
      fixture.detectChanges();

      expect(component.iconName()).toBe('star');
    });

    it('should propagate actionLabel input to standard component', () => {
      fixture.componentRef.setInput('actionLabel', 'Click');
      fixture.detectChanges();

      expect(component.actionLabel()).toBe('Click');
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', {
        variant: 'with-label',
        position: 'left',
      });
      fixture.detectChanges();

      expect(component.options()).toEqual({
        variant: 'with-label',
        position: 'left',
      });
    });

    it('should forward actionClick output from standard component', () => {
      fixture.componentRef.setInput('actionLabel', 'Click');
      fixture.detectChanges();

      let emitted = false;
      component.actionClick.subscribe(() => (emitted = true));

      const button = fixture.nativeElement.querySelector(
        'button.smart-divider-action',
      );
      button.click();

      expect(emitted).toBe(true);
    });
  });

  describe('with DIVIDER_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<DividerComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DividerComponent, MockInjectedComponent],
        providers: [
          {
            provide: DIVIDER_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(DividerComponent);
      fixture.detectChanges();
    });

    it('should render injected component when DIVIDER_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-divider',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-divider-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-divider-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
