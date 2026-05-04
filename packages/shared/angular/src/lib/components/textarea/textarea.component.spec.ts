import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaBaseComponent } from './base/base.component';
import { TextareaComponent } from './textarea.component';
import { TEXTAREA_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-textarea-injected',
  template: '<div class="injected-textarea">injected</div>',
})
class MockInjectedComponent extends TextareaBaseComponent {
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: TextareaComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<TextareaComponent>;
    let component: TextareaComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TextareaComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TextareaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-textarea-standard by default', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-textarea-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate placeholder/disabled/options/class', () => {
      fixture.componentRef.setInput('placeholder', 'Type...');
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('options', { rows: 5 });
      fixture.componentRef.setInput('class', 'wrap');
      fixture.detectChanges();

      expect(component.placeholder()).toBe('Type...');
      expect(component.disabled()).toBe(true);
      expect(component.options()).toEqual({ rows: 5 });
      expect(component.cssClass()).toBe('wrap');
    });
  });

  describe('with TEXTAREA_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<TextareaComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TextareaComponent, MockInjectedComponent],
        providers: [
          {
            provide: TEXTAREA_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TextareaComponent);
      fixture.detectChanges();
    });

    it('should render injected component when token provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-textarea',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-textarea-standard when token provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-textarea-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
