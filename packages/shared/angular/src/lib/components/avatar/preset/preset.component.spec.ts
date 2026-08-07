import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarPresetComponent } from './preset.component';

describe('@smartsoft001/shared-angular: AvatarPresetComponent', () => {
  let fixture: ComponentFixture<AvatarPresetComponent>;
  let component: AvatarPresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarPresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(AvatarPresetComponent);
  });

  it('should render an <img> with the image classes when imageUrl is set', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/a.png');
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');

    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('https://example.com/a.png');
    expect(img.className).toContain('smart:rounded-full');
    expect(img.className).toContain('smart:size-11');
  });

  it('should render initials when no imageUrl is provided', () => {
    fixture.componentRef.setInput('initials', 'AC');
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span.textContent?.trim()).toBe('AC');
    expect(span.className).toContain('smart:bg-gray-700');
  });

  it('should render the icon placeholder when neither image nor initials is set', () => {
    const svg = fixture.nativeElement.querySelector('svg');

    expect(svg).toBeTruthy();
  });

  it('should render initials placeholder when options.placeholderType is "initials"', () => {
    fixture.componentRef.setInput('options', { placeholderType: 'initials' });
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');

    expect(svg).toBeNull();
  });

  it('should apply rounded shape classes', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/a.png');
    fixture.componentRef.setInput('shape', 'rounded');
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');

    expect(img.className).toContain('smart:rounded-lg');
    expect(img.className).not.toContain('smart:rounded-full');
  });

  it('should apply the size classes for the requested size', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/a.png');
    fixture.componentRef.setInput('size', 'xl');
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');

    expect(img.className).toContain('smart:size-20');
  });

  it('should render a status dot at the top when notificationPosition is "top"', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/a.png');
    fixture.componentRef.setInput('notificationPosition', 'top');
    fixture.detectChanges();

    const dot = fixture.nativeElement.querySelector('span');

    expect(dot).toBeTruthy();
    expect(dot.className).toContain('smart:top-0');
    expect(dot.className).toContain('smart:rounded-full');
  });

  it('should render a status dot at the bottom when notificationPosition is "bottom"', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/a.png');
    fixture.componentRef.setInput('notificationPosition', 'bottom');
    fixture.detectChanges();

    const dot = fixture.nativeElement.querySelector('span');

    expect(dot.className).toContain('smart:bottom-0');
  });

  it('should NOT render a status dot by default', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/a.png');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('span')).toBeNull();
  });

  it('should render one stacked member per group item', () => {
    fixture.componentRef.setInput('group', [
      { id: '1', imageUrl: 'https://example.com/1.png' },
      { id: '2', initials: 'AC' },
      { id: '3', imageUrl: 'https://example.com/3.png' },
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('img').length).toBe(2);
    expect(
      fixture.nativeElement.querySelector('span')?.textContent?.trim(),
    ).toBe('AC');
  });

  it('should reverse the stack when options.stackDirection is "bottom-to-top"', () => {
    fixture.componentRef.setInput('group', [{ id: '1', initials: 'AC' }]);
    fixture.componentRef.setInput('options', {
      stackDirection: 'bottom-to-top',
    });
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('div');

    expect(container.className).toContain('smart:flex-row-reverse');
  });

  it('should apply cssClass on the rendered avatar (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/a.png');
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('img').className).toContain(
      'my-extra-class',
    );
  });
});
