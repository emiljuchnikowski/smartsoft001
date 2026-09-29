import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarStandardComponent } from './standard.component';

describe('@smartsoft001/shared-angular: AvatarStandardComponent', () => {
  let fixture: ComponentFixture<AvatarStandardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarStandardComponent);
    fixture.detectChanges();
  });

  it('should render <img> with src=imageUrl when imageUrl is provided', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/avatar.png');
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');

    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('https://example.com/avatar.png');
  });

  it('should render initials when no imageUrl is provided', () => {
    fixture.componentRef.setInput('initials', 'AB');
    fixture.detectChanges();

    const initials = fixture.nativeElement.querySelector(
      '.smart-avatar-initials',
    );

    expect(initials).toBeTruthy();
    expect(initials.textContent.trim()).toBe('AB');
  });

  it('should render the placeholder when neither imageUrl nor initials is provided', () => {
    const placeholder = fixture.nativeElement.querySelector(
      '.smart-avatar-placeholder',
    );

    expect(placeholder).toBeTruthy();
  });

  it('should render one .smart-avatar-group-item per group item', () => {
    fixture.componentRef.setInput('group', [
      { id: '1', initials: 'AB' },
      { id: '2', imageUrl: 'https://example.com/2.png' },
      { id: '3', initials: 'CD' },
    ]);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll(
      '.smart-avatar-group-item',
    );

    expect(items.length).toBe(3);
  });

  it('should set data-size attribute on the host span', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span.getAttribute('data-size')).toBe('lg');
  });

  it('should set data-shape attribute on the host span', () => {
    fixture.componentRef.setInput('shape', 'rounded');
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span.getAttribute('data-shape')).toBe('rounded');
  });

  it('should include external cssClass on the host span when provided', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span.className).toContain('my-extra-class');
  });

  it('should render initials when placeholderType is initials and initials are set', () => {
    fixture.componentRef.setInput('initials', 'AB');
    fixture.componentRef.setInput('options', { placeholderType: 'initials' });
    fixture.detectChanges();

    const initials = fixture.nativeElement.querySelector(
      '.smart-avatar-initials',
    );

    expect(initials.textContent.trim()).toBe('AB');
  });

  it('should keep the placeholder when placeholderType is initials but no initials are set', () => {
    fixture.componentRef.setInput('options', { placeholderType: 'initials' });
    fixture.detectChanges();

    const placeholder = fixture.nativeElement.querySelector(
      '.smart-avatar-placeholder',
    );

    expect(placeholder).toBeTruthy();
  });

  it('should expose data-placeholder-type="icon" by default', () => {
    const span = fixture.nativeElement.querySelector('span');

    expect(span.getAttribute('data-placeholder-type')).toBe('icon');
  });

  it('should reflect options.placeholderType in data-placeholder-type', () => {
    fixture.componentRef.setInput('options', { placeholderType: 'initials' });
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span.getAttribute('data-placeholder-type')).toBe('initials');
  });

  it('should expose data-stack-direction="top-to-bottom" on the group container by default', () => {
    fixture.componentRef.setInput('group', [{ id: '1', initials: 'AB' }]);
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span.getAttribute('data-stack-direction')).toBe('top-to-bottom');
  });

  it('should reflect options.stackDirection in data-stack-direction on the group container', () => {
    fixture.componentRef.setInput('group', [{ id: '1', initials: 'AB' }]);
    fixture.componentRef.setInput('options', {
      stackDirection: 'bottom-to-top',
    });
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span.getAttribute('data-stack-direction')).toBe('bottom-to-top');
  });

  it('should NOT expose data-stack-direction when not rendering a group', () => {
    const span = fixture.nativeElement.querySelector('span');

    expect(span.hasAttribute('data-stack-direction')).toBe(false);
  });
});
