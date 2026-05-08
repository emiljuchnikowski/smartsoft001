import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarComponent } from './avatar.component';
import { AvatarBaseComponent } from './base/base.component';
import { AVATAR_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-avatar-injected',
  template: '<div class="injected-avatar">injected</div>',
})
class MockInjectedComponent extends AvatarBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: AvatarComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<AvatarComponent>;
    let component: AvatarComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AvatarComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(AvatarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-avatar-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-avatar-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate imageUrl input to standard component', () => {
      fixture.componentRef.setInput(
        'imageUrl',
        'https://example.com/avatar.png',
      );
      fixture.detectChanges();

      expect(component.imageUrl()).toBe('https://example.com/avatar.png');
    });

    it('should propagate initials input to standard component', () => {
      fixture.componentRef.setInput('initials', 'AB');
      fixture.detectChanges();

      expect(component.initials()).toBe('AB');
    });

    it('should propagate size input to standard component', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();

      expect(component.size()).toBe('lg');
    });

    it('should propagate shape input to standard component', () => {
      fixture.componentRef.setInput('shape', 'rounded');
      fixture.detectChanges();

      expect(component.shape()).toBe('rounded');
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate group input to standard component', () => {
      fixture.componentRef.setInput('group', [{ id: '1', initials: 'AB' }]);
      fixture.detectChanges();

      expect(component.group()).toEqual([{ id: '1', initials: 'AB' }]);
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', {
        placeholderType: 'initials',
      });
      fixture.detectChanges();

      expect(component.options()).toEqual({ placeholderType: 'initials' });
    });
  });

  describe('with AVATAR_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<AvatarComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AvatarComponent, MockInjectedComponent],
        providers: [
          {
            provide: AVATAR_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AvatarComponent);
      fixture.detectChanges();
    });

    it('should render injected component when AVATAR_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-avatar',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-avatar-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-avatar-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
