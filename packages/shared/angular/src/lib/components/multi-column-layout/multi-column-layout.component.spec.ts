import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiColumnLayoutBaseComponent } from './base/base.component';
import { MultiColumnLayoutComponent } from './multi-column-layout.component';
import { MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-multi-column-layout-injected',
  template: '<div class="injected-multi-column-layout">injected</div>',
})
class MockInjectedComponent extends MultiColumnLayoutBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: MultiColumnLayoutComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<MultiColumnLayoutComponent>;
    let component: MultiColumnLayoutComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MultiColumnLayoutComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(MultiColumnLayoutComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-multi-column-layout-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-multi-column-layout-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', { title: 'Inbox' });
      fixture.detectChanges();

      expect(component.options()).toEqual({ title: 'Inbox' });
    });
  });

  describe('with MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<MultiColumnLayoutComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MultiColumnLayoutComponent, MockInjectedComponent],
        providers: [
          {
            provide: MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(MultiColumnLayoutComponent);
      fixture.detectChanges();
    });

    it('should render injected component when MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-multi-column-layout',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-multi-column-layout-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-multi-column-layout-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
