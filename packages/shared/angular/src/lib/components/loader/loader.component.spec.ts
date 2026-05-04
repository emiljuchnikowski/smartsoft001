import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LOADER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { LoaderBaseComponent } from './base/base.component';
import { LoaderComponent } from './loader.component';

@Component({
  selector: 'smart-test-injected-loader',
  template: '<div class="injected-loader">injected</div>',
})
class MockInjectedLoaderComponent extends LoaderBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: LoaderComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<LoaderComponent>;
    let component: LoaderComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LoaderComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(LoaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-loader-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-loader-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate show=true to the standard component', () => {
      fixture.componentRef.setInput('show', true);
      fixture.detectChanges();

      const svg = fixture.nativeElement.querySelector(
        'smart-loader-standard svg',
      );

      expect(svg).toBeTruthy();
    });

    it('should propagate size input to the standard component', () => {
      fixture.componentRef.setInput('show', true);
      fixture.componentRef.setInput('size', 'xl');
      fixture.detectChanges();

      const svg = fixture.nativeElement.querySelector(
        'smart-loader-standard svg',
      );

      expect(svg!.getAttribute('class')).toContain('smart:size-10');
    });

    it('should propagate color input to the standard component', () => {
      fixture.componentRef.setInput('show', true);
      fixture.componentRef.setInput('color', 'red');
      fixture.detectChanges();

      const svg = fixture.nativeElement.querySelector(
        'smart-loader-standard svg',
      );

      expect(svg!.getAttribute('class')).toContain('smart:text-red-600');
    });

    it('should propagate cssClass via class alias to the standard component', () => {
      fixture.componentRef.setInput('show', true);
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      const svg = fixture.nativeElement.querySelector(
        'smart-loader-standard svg',
      );

      expect(component.cssClass()).toBe('passed-class');
      expect(svg!.getAttribute('class')).toContain('passed-class');
    });
  });

  describe('with LOADER_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<LoaderComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LoaderComponent, MockInjectedLoaderComponent],
        providers: [
          {
            provide: LOADER_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedLoaderComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(LoaderComponent);
      fixture.detectChanges();
    });

    it('should render injected component when LOADER_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-loader',
      );

      expect(injected).toBeTruthy();
    });
  });
});
