import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableBaseComponent } from './base/base.component';
import { TableComponent } from './table.component';
import { TABLE_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-table-injected',
  template: '<div class="injected-table">injected</div>',
})
class MockInjectedComponent extends TableBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: TableComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<TableComponent>;
    let component: TableComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TableComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TableComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-table-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-table-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', { title: 'Users' });
      fixture.detectChanges();

      expect(component.options()).toEqual({ title: 'Users' });
    });
  });

  describe('with TABLE_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<TableComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TableComponent, MockInjectedComponent],
        providers: [
          {
            provide: TABLE_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TableComponent);
      fixture.detectChanges();
    });

    it('should render injected component when TABLE_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected =
        fixture.nativeElement.querySelector('div.injected-table');

      expect(injected).toBeTruthy();
    });

    it('should not render smart-table-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-table-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
