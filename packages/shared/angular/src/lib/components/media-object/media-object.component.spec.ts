import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaObjectBaseComponent } from './base/base.component';
import { MediaObjectComponent } from './media-object.component';
import { MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-media-object-injected',
  template: '<div class="injected-media-object">injected</div>',
})
class MockInjectedComponent extends MediaObjectBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: MediaObjectComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<MediaObjectComponent>;
    let component: MediaObjectComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MediaObjectComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(MediaObjectComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput(
        'mediaUrl',
        'https://example.com/image.png',
      );
      fixture.componentRef.setInput('mediaAlt', 'Example image');
      fixture.detectChanges();
    });

    it('should render smart-media-object-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-media-object-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate mediaUrl input to standard component', () => {
      expect(component.mediaUrl()).toBe('https://example.com/image.png');
    });

    it('should propagate mediaAlt input to standard component', () => {
      expect(component.mediaAlt()).toBe('Example image');
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', { position: 'right' });
      fixture.detectChanges();

      expect(component.options()).toEqual({ position: 'right' });
    });
  });

  describe('with MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<MediaObjectComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MediaObjectComponent, MockInjectedComponent],
        providers: [
          {
            provide: MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(MediaObjectComponent);
      fixture.componentRef.setInput(
        'mediaUrl',
        'https://example.com/image.png',
      );
      fixture.componentRef.setInput('mediaAlt', 'Example image');
      fixture.detectChanges();
    });

    it('should render injected component when MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-media-object',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-media-object-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-media-object-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
