import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedListBaseComponent } from './base/base.component';
import { StackedListComponent } from './stacked-list.component';
import { STACKED_LIST_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-stacked-list-injected',
  template: '<div class="injected-stacked-list">injected</div>',
})
class MockInjectedComponent extends StackedListBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: StackedListComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<StackedListComponent>;
    let component: StackedListComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StackedListComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(StackedListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-stacked-list-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-stacked-list-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', {
        title: 'Team members',
      });
      fixture.detectChanges();

      expect(component.options()).toEqual({ title: 'Team members' });
    });
  });

  describe('with STACKED_LIST_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<StackedListComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StackedListComponent, MockInjectedComponent],
        providers: [
          {
            provide: STACKED_LIST_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(StackedListComponent);
      fixture.detectChanges();
    });

    it('should render injected component when STACKED_LIST_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-stacked-list',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-stacked-list-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-stacked-list-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
