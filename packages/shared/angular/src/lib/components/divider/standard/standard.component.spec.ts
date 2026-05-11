import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividerStandardComponent } from './standard.component';

describe('@smartsoft001/shared-angular: DividerStandardComponent', () => {
  let fixture: ComponentFixture<DividerStandardComponent>;
  let component: DividerStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DividerStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DividerStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render an element with role="separator"', () => {
    const separator = fixture.nativeElement.querySelector('[role="separator"]');

    expect(separator).toBeTruthy();
  });

  it('should render <hr /> when no label, title or actionLabel is provided', () => {
    const hr = fixture.nativeElement.querySelector('hr');

    expect(hr).toBeTruthy();
  });

  it('should NOT render <hr /> when label is provided', () => {
    fixture.componentRef.setInput('label', 'My label');
    fixture.detectChanges();

    const hr = fixture.nativeElement.querySelector('hr');

    expect(hr).toBeNull();
  });

  it('should NOT render <hr /> when title is provided', () => {
    fixture.componentRef.setInput('title', 'My title');
    fixture.detectChanges();

    const hr = fixture.nativeElement.querySelector('hr');

    expect(hr).toBeNull();
  });

  it('should NOT render <hr /> when actionLabel is provided', () => {
    fixture.componentRef.setInput('actionLabel', 'Action');
    fixture.detectChanges();

    const hr = fixture.nativeElement.querySelector('hr');

    expect(hr).toBeNull();
  });

  it('should render label text when label is provided', () => {
    fixture.componentRef.setInput('label', 'My label');
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('.smart-divider-label');

    expect(label).toBeTruthy();
    expect(label.textContent.trim()).toBe('My label');
  });

  it('should render title text when title is provided', () => {
    fixture.componentRef.setInput('title', 'My title');
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.smart-divider-title');

    expect(title).toBeTruthy();
    expect(title.textContent.trim()).toBe('My title');
  });

  it('should render action button when actionLabel is provided', () => {
    fixture.componentRef.setInput('actionLabel', 'Click me');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'button.smart-divider-action',
    );

    expect(button).toBeTruthy();
    expect(button.textContent.trim()).toBe('Click me');
  });

  it('should emit actionClick when action button is clicked', () => {
    fixture.componentRef.setInput('actionLabel', 'Click me');
    fixture.detectChanges();

    let emitted = false;
    component.actionClick.subscribe(() => (emitted = true));

    const button = fixture.nativeElement.querySelector(
      'button.smart-divider-action',
    );
    button.click();

    expect(emitted).toBe(true);
  });

  it('should set data-position attribute from options.position', () => {
    fixture.componentRef.setInput('options', { position: 'left' });
    fixture.detectChanges();

    const separator = fixture.nativeElement.querySelector('[role="separator"]');

    expect(separator.getAttribute('data-position')).toBe('left');
  });

  it('should default data-position to "center" when no options provided', () => {
    const separator = fixture.nativeElement.querySelector('[role="separator"]');

    expect(separator.getAttribute('data-position')).toBe('center');
  });

  it('should apply cssClass on the host div', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const separator = fixture.nativeElement.querySelector('[role="separator"]');

    expect(separator.className).toContain('my-extra-class');
  });
});
