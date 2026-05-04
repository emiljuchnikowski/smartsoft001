import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsBaseComponent } from './base/base.component';
import { TabsComponent } from './tabs.component';
import { TABS_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-tabs-injected',
  template: '<div class="injected-tabs">injected</div>',
})
class MockInjectedComponent extends TabsBaseComponent {
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: TabsComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<TabsComponent>;
    let component: TabsComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TabsComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TabsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-tabs-standard by default', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-tabs-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate options/selectedId/class', () => {
      fixture.componentRef.setInput('options', {
        items: [{ id: 'a', label: 'A' }],
      });
      fixture.componentRef.setInput('selectedId', 'a');
      fixture.componentRef.setInput('class', 'wrap');
      fixture.detectChanges();

      expect(component.options()?.items?.[0].id).toBe('a');
      expect(component.selectedId()).toBe('a');
      expect(component.cssClass()).toBe('wrap');
    });
  });

  describe('with TABS_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<TabsComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TabsComponent, MockInjectedComponent],
        providers: [
          {
            provide: TABS_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TabsComponent);
      fixture.detectChanges();
    });

    it('should render injected component when token provided', () => {
      const injected = fixture.nativeElement.querySelector('div.injected-tabs');

      expect(injected).toBeTruthy();
    });

    it('should not render smart-tabs-standard when token provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-tabs-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
