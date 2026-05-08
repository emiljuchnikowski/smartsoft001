import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeStandardComponent } from './standard.component';

describe('@smartsoft001/shared-angular: BadgeStandardComponent', () => {
  let fixture: ComponentFixture<BadgeStandardComponent>;
  let component: BadgeStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeStandardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('text', 'Badge');
    fixture.detectChanges();
  });

  it('should render the text inside the badge', () => {
    const textEl = fixture.nativeElement.querySelector('.smart-badge-text');

    expect(textEl).toBeTruthy();
    expect(textEl.textContent.trim()).toBe('Badge');
  });

  it('should NOT render the dot when withDot is not set', () => {
    const dot = fixture.nativeElement.querySelector('.smart-badge-dot');

    expect(dot).toBeNull();
  });

  it('should render the dot when options.withDot is true', () => {
    fixture.componentRef.setInput('options', { withDot: true });
    fixture.detectChanges();

    const dot = fixture.nativeElement.querySelector('.smart-badge-dot');

    expect(dot).toBeTruthy();
  });

  it('should NOT render the remove button when withRemove is not set', () => {
    const button = fixture.nativeElement.querySelector('button');

    expect(button).toBeNull();
  });

  it('should render the remove button when options.withRemove is true', () => {
    fixture.componentRef.setInput('options', { withRemove: true });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button).toBeTruthy();
    expect(button.getAttribute('aria-label')).toBe('Remove');
  });

  it('should emit removed when the remove button is clicked', () => {
    fixture.componentRef.setInput('options', { withRemove: true });
    fixture.detectChanges();

    const spy = jest.fn();
    component.removed.subscribe(spy);

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should reflect color() in the data-color attribute', () => {
    fixture.componentRef.setInput('color', 'red');
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span.getAttribute('data-color')).toBe('red');
  });

  it('should reflect size() in the data-size attribute', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span.getAttribute('data-size')).toBe('sm');
  });

  it('should include external cssClass on the host span when provided', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span.className).toContain('my-extra-class');
  });
});
