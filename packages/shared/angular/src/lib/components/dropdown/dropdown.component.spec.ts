import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownBaseComponent } from './base/base.component';
import { DropdownComponent } from './dropdown.component';
import { DROPDOWN_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-dropdown-injected',
  template: '<div class="injected-dropdown">injected</div>',
})
class MockInjectedComponent extends DropdownBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: DropdownComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<DropdownComponent>;
    let component: DropdownComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DropdownComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(DropdownComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-dropdown-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-dropdown-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate items input to standard component', () => {
      fixture.componentRef.setInput('items', [{ id: 'a', label: 'Alpha' }]);
      fixture.detectChanges();

      expect(component.items()).toEqual([{ id: 'a', label: 'Alpha' }]);
    });

    it('should propagate triggerLabel input to standard component', () => {
      fixture.componentRef.setInput('triggerLabel', 'Open menu');
      fixture.detectChanges();

      expect(component.triggerLabel()).toBe('Open menu');
    });

    it('should propagate open input to standard component', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      expect(component.open()).toBe(true);
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', {
        variant: 'with-header',
        headerLabel: 'Menu',
      });
      fixture.detectChanges();

      expect(component.options()).toEqual({
        variant: 'with-header',
        headerLabel: 'Menu',
      });
    });

    it('should forward selectedItem from standard component', () => {
      fixture.componentRef.setInput('items', [{ id: 'a', label: 'Alpha' }]);
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      let emitted: { itemId: string } | null = null;
      component.selectedItem.subscribe((event) => (emitted = event));

      const button = fixture.nativeElement.querySelector(
        'li[role="menuitem"] button',
      );
      button.click();
      fixture.detectChanges();

      expect(emitted).toEqual({ itemId: 'a' });
    });
  });

  describe('with DROPDOWN_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<DropdownComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DropdownComponent, MockInjectedComponent],
        providers: [
          {
            provide: DROPDOWN_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(DropdownComponent);
      fixture.detectChanges();
    });

    it('should render injected component when DROPDOWN_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-dropdown',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-dropdown-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-dropdown-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
