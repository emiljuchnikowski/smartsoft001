import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridListBaseComponent } from './base/base.component';
import { GridListComponent } from './grid-list.component';
import { GRID_LIST_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-grid-list-injected',
  template: '<div class="injected-grid-list">injected</div>',
})
class MockInjectedComponent extends GridListBaseComponent {
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: GridListComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<GridListComponent>;
    let component: GridListComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [GridListComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(GridListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-grid-list-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-grid-list-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', { title: 'Team' });
      fixture.detectChanges();

      expect(component.options()).toEqual({ title: 'Team' });
    });
  });

  describe('with GRID_LIST_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<GridListComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [GridListComponent, MockInjectedComponent],
        providers: [
          {
            provide: GRID_LIST_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(GridListComponent);
      fixture.detectChanges();
    });

    it('should render injected component when GRID_LIST_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-grid-list',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-grid-list-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-grid-list-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
