import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContainerBaseComponent } from './base/base.component';
import { ListContainerComponent } from './list-container.component';
import { LIST_CONTAINER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-list-container-injected',
  template: '<div class="injected-list-container">injected</div>',
})
class MockInjectedComponent extends ListContainerBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: ListContainerComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<ListContainerComponent>;
    let component: ListContainerComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ListContainerComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ListContainerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-list-container-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-list-container-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', { variant: 'separate-cards' });
      fixture.detectChanges();

      expect(component.options()).toEqual({ variant: 'separate-cards' });
    });
  });

  describe('with LIST_CONTAINER_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<ListContainerComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ListContainerComponent, MockInjectedComponent],
        providers: [
          {
            provide: LIST_CONTAINER_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ListContainerComponent);
      fixture.detectChanges();
    });

    it('should render injected component when LIST_CONTAINER_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-list-container',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-list-container-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-list-container-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
