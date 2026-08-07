import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgePresetComponent } from './preset.component';

describe('@smartsoft001/shared-angular: BadgePresetComponent', () => {
  let fixture: ComponentFixture<BadgePresetComponent>;
  let component: BadgePresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgePresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgePresetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('text', 'Badge');
    fixture.detectChanges();
  });

  function span(): HTMLElement {
    return fixture.nativeElement.querySelector('span');
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(BadgePresetComponent);
  });

  it('should render the badge text', () => {
    expect(span().textContent?.trim()).toContain('Badge');
  });

  it('should default to the soft variant (gray, md)', () => {
    const cls = span().className;

    expect(cls).toContain('smart:bg-gray-100');
    expect(cls).toContain('smart:rounded-full');
    expect(cls).toContain('smart:px-3');
  });

  it('should apply solid variant classes', () => {
    fixture.componentRef.setInput('color', 'red');
    fixture.componentRef.setInput('options', { variant: 'solid' });
    fixture.detectChanges();

    const cls = span().className;

    expect(cls).toContain('smart:bg-red-600');
    expect(cls).toContain('smart:text-white');
  });

  it('should apply soft variant classes', () => {
    fixture.componentRef.setInput('color', 'green');
    fixture.componentRef.setInput('options', { variant: 'soft' });
    fixture.detectChanges();

    const cls = span().className;

    expect(cls).toContain('smart:bg-green-100');
    expect(cls).toContain('smart:text-green-800');
  });

  it('should apply outline variant classes', () => {
    fixture.componentRef.setInput('color', 'blue');
    fixture.componentRef.setInput('options', { variant: 'outline' });
    fixture.detectChanges();

    const cls = span().className;

    expect(cls).toContain('smart:border');
    expect(cls).toContain('smart:border-blue-500');
    expect(cls).toContain('smart:text-blue-700');
  });

  it('should apply the sm size classes', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    const cls = span().className;

    expect(cls).toContain('smart:px-2');
    expect(cls).toContain('smart:py-0.5');
  });

  it('should render square corners when pill is false', () => {
    fixture.componentRef.setInput('options', { pill: false });
    fixture.detectChanges();

    const cls = span().className;

    expect(cls).toContain('smart:rounded-md');
    expect(cls).not.toContain('smart:rounded-full');
  });

  it('should render a leading dot when options.withDot is true', () => {
    fixture.componentRef.setInput('options', { withDot: true });
    fixture.detectChanges();

    const dot = span().querySelector('svg circle');

    expect(dot).toBeTruthy();
  });

  it('should NOT render a dot by default', () => {
    expect(span().querySelector('svg circle')).toBeNull();
  });

  it('should render a remove button when options.withRemove is true', () => {
    fixture.componentRef.setInput('options', { withRemove: true });
    fixture.detectChanges();

    const button = span().querySelector('button[aria-label="Remove"]');

    expect(button).toBeTruthy();
  });

  it('should emit removed when the remove button is clicked', () => {
    fixture.componentRef.setInput('options', { withRemove: true });
    fixture.detectChanges();

    let emitted = false;
    component.removed.subscribe(() => (emitted = true));

    span().querySelector<HTMLButtonElement>('button')?.click();

    expect(emitted).toBe(true);
  });

  it('should apply cssClass on the host span (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    expect(span().className).toContain('my-extra-class');
  });
});
