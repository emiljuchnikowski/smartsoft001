import { Component, input, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@ngx-translate/core';

import { SearchbarBaseComponent } from './base/base.component';
import { SearchbarComponent } from './searchbar.component';
import { SearchbarStandardComponent } from './standard/standard.component';
import { SEARCHBAR_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Component({
  selector: 'smart-test-searchbar-injected',
  template: '<div class="injected-searchbar">injected</div>',
})
class MockInjectedComponent extends SearchbarBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: SearchbarComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<SearchbarComponent>;
    let component: SearchbarComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SearchbarComponent],
      })
        .overrideComponent(SearchbarStandardComponent, {
          remove: { imports: [TranslatePipe] },
          add: { imports: [MockTranslatePipe] },
        })
        .compileComponents();

      fixture = TestBed.createComponent(SearchbarComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('text', '');
      fixture.detectChanges();
    });

    it('should render smart-searchbar-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-searchbar-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate text input to standard component', () => {
      fixture.componentRef.setInput('text', 'hello');
      fixture.detectChanges();

      expect(component.text()).toBe('hello');
    });

    it('should propagate show input to standard component', () => {
      fixture.componentRef.setInput('show', false);
      fixture.detectChanges();

      expect(component.show()).toBe(false);
    });

    it('should propagate cssClass input to standard component', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', { placeholder: 'my-search' });
      fixture.detectChanges();

      expect(component.options()).toEqual({ placeholder: 'my-search' });
    });
  });

  describe('with SEARCHBAR_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<SearchbarComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SearchbarComponent, MockInjectedComponent],
        providers: [
          {
            provide: SEARCHBAR_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SearchbarComponent);
      fixture.componentRef.setInput('text', '');
      fixture.detectChanges();
    });

    it('should render injected component when SEARCHBAR_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-searchbar',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-searchbar-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-searchbar-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
