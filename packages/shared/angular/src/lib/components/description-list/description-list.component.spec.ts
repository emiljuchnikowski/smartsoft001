import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionListBaseComponent } from './base/base.component';
import { DescriptionListComponent } from './description-list.component';
import { DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-description-list-injected',
  template: '<div class="injected-description-list">injected</div>',
})
class MockInjectedComponent extends DescriptionListBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: DescriptionListComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<DescriptionListComponent>;
    let component: DescriptionListComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DescriptionListComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(DescriptionListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-description-list-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-description-list-standard',
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
        title: 'Applicant Information',
      });
      fixture.detectChanges();

      expect(component.options()).toEqual({ title: 'Applicant Information' });
    });
  });

  describe('with DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<DescriptionListComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DescriptionListComponent, MockInjectedComponent],
        providers: [
          {
            provide: DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(DescriptionListComponent);
      fixture.detectChanges();
    });

    it('should render injected component when DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-description-list',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-description-list-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-description-list-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
