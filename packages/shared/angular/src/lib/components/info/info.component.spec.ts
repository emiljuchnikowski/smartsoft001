import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@ngx-translate/core';

import { IInfoOptions } from '../../models';
import { INFO_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { InfoBaseComponent } from './base/base.component';
import { InfoComponent } from './info.component';
import { InfoStandardComponent } from './standard/standard.component';

@Component({
  selector: 'smart-test-injected-info',
  template: '<div class="injected-info">injected</div>',
})
class MockInjectedInfoComponent extends InfoBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: InfoComponent', () => {
  const defaultOptions: IInfoOptions = { text: 'wrapper info text' };

  describe('without token', () => {
    let fixture: ComponentFixture<InfoComponent>;
    let component: InfoComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [InfoComponent],
      })
        .overrideComponent(InfoStandardComponent, {
          remove: { imports: [TranslatePipe] },
        })
        .compileComponents();

      fixture = TestBed.createComponent(InfoComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('options', defaultOptions);
      fixture.detectChanges();
    });

    it('should render smart-info-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-info-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should pass options to standard component', () => {
      const opts: IInfoOptions = { text: 'changed' };
      fixture.componentRef.setInput('options', opts);
      fixture.detectChanges();

      expect(component.options()).toEqual(opts);
    });

    it('should pass cssClass via class alias to standard component', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });
  });

  describe('with INFO_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<InfoComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [InfoComponent, MockInjectedInfoComponent],
        providers: [
          {
            provide: INFO_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedInfoComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(InfoComponent);
      fixture.componentRef.setInput('options', defaultOptions);
      fixture.detectChanges();
    });

    it('should render injected component when INFO_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector('div.injected-info');

      expect(injected).toBeTruthy();
    });
  });
});
