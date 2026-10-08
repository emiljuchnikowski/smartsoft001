import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerBaseComponent } from './base/base.component';
import { ContainerComponent } from './container.component';
import { CONTAINER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-container-injected',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<div class="injected-container">injected</div>',
})
class MockInjectedComponent extends ContainerBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

@Component({
  selector: 'smart-test-container-with-slot',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<div class="custom-container"><ng-content /></div>',
})
class MockSlotComponent extends ContainerBaseComponent {
  override cssClass = input<string>('');
}

const PROJECTION_HOST_TEMPLATE = `
  <smart-container>Projected text</smart-container>
`;

@Component({
  selector: 'smart-test-container-standard-host',
  imports: [ContainerComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: PROJECTION_HOST_TEMPLATE,
})
class StandardHostComponent {}

@Component({
  selector: 'smart-test-container-host',
  imports: [ContainerComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: CONTAINER_STANDARD_COMPONENT_TOKEN,
      useValue: MockSlotComponent,
    },
  ],
  template: PROJECTION_HOST_TEMPLATE,
})
class InjectedHostComponent {}

describe('@smartsoft001/shared-angular: ContainerComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<ContainerComponent>;
    let component: ContainerComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ContainerComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ContainerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-container-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-container-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', { mode: 'constrained' });
      fixture.detectChanges();

      expect(component.options()).toEqual({ mode: 'constrained' });
    });
  });

  describe('with CONTAINER_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<ContainerComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ContainerComponent, MockInjectedComponent],
        providers: [
          {
            provide: CONTAINER_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ContainerComponent);
      fixture.detectChanges();
    });

    it('should render injected component when CONTAINER_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-container',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-container-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-container-standard',
      );

      expect(standard).toBeNull();
    });
  });

  describe('projected content', () => {
    it('should render the projected content inside smart-container-standard', () => {
      const fixture = TestBed.createComponent(StandardHostComponent);
      fixture.detectChanges();

      const slot = fixture.nativeElement.querySelector(
        'smart-container-standard div',
      );

      expect(slot?.textContent.trim()).toBe('Projected text');
    });

    it('should render the projected content inside the implementation registered through CONTAINER_STANDARD_COMPONENT_TOKEN', () => {
      const fixture = TestBed.createComponent(InjectedHostComponent);
      fixture.detectChanges();

      const slot = fixture.nativeElement.querySelector('div.custom-container');

      expect(slot?.textContent.trim()).toBe('Projected text');
    });
  });
});
