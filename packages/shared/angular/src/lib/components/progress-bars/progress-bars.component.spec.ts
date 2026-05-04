import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarsBaseComponent } from './base/base.component';
import { ProgressBarsComponent } from './progress-bars.component';
import { PROGRESS_BARS_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-progress-bars-injected',
  template: '<div class="injected-progress-bars">injected</div>',
})
class MockInjectedComponent extends ProgressBarsBaseComponent {
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: ProgressBarsComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<ProgressBarsComponent>;
    let component: ProgressBarsComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ProgressBarsComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ProgressBarsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-progress-bars-standard by default', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-progress-bars-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate options/class', () => {
      fixture.componentRef.setInput('options', {
        steps: [{ id: 's1', name: 'A' }],
      });
      fixture.componentRef.setInput('class', 'wrap');
      fixture.detectChanges();

      expect(component.options()?.steps?.length).toBe(1);
      expect(component.cssClass()).toBe('wrap');
    });
  });

  describe('with PROGRESS_BARS_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<ProgressBarsComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ProgressBarsComponent, MockInjectedComponent],
        providers: [
          {
            provide: PROGRESS_BARS_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ProgressBarsComponent);
      fixture.detectChanges();
    });

    it('should render injected component when token provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-progress-bars',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-progress-bars-standard when token provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-progress-bars-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
