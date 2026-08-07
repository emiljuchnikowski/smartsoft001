import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonGroupPresetComponent } from './preset.component';
import { IButtonGroupButton } from '../../../models';

const BUTTONS: IButtonGroupButton[] = [
  { id: 'years', label: 'Years' },
  { id: 'month', label: 'Month' },
  { id: 'date', label: 'Date' },
];

describe('@smartsoft001/shared-angular: ButtonGroupPresetComponent', () => {
  let fixture: ComponentFixture<ButtonGroupPresetComponent>;
  let component: ButtonGroupPresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonGroupPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonGroupPresetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('buttons', BUTTONS);
    fixture.detectChanges();
  });

  function group(): HTMLElement {
    return fixture.nativeElement.querySelector('div[role="group"]');
  }

  function buttons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('button'));
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(ButtonGroupPresetComponent);
  });

  it('should render one button per item', () => {
    const labels = buttons().map((b) => b.textContent?.trim());

    expect(buttons()).toHaveLength(3);
    expect(labels).toEqual(['Years', 'Month', 'Date']);
  });

  it('should apply the segmented group container classes', () => {
    const cls = group().className;

    expect(cls).toContain('smart:inline-flex');
    expect(cls).toContain('smart:rounded-lg');
    expect(cls).toContain('smart:shadow-2xs');
  });

  it('should apply the base button classes', () => {
    const cls = buttons()[0].className;

    expect(cls).toContain('smart:bg-white');
    expect(cls).toContain('smart:dark:bg-gray-800');
    expect(cls).toContain('smart:first:rounded-s-lg');
    expect(cls).toContain('smart:py-3');
    expect(cls).toContain('smart:px-4');
  });

  it('should mark the selected button as pressed and emphasised', () => {
    fixture.componentRef.setInput('selected', 'month');
    fixture.detectChanges();

    const selected = buttons()[1];

    expect(selected.getAttribute('aria-pressed')).toBe('true');
    expect(selected.className).toContain('smart:text-blue-600');
  });

  it('should disable a button flagged as disabled', () => {
    fixture.componentRef.setInput('buttons', [
      { id: 'a', label: 'A', disabled: true },
    ]);
    fixture.detectChanges();

    expect(buttons()[0].disabled).toBe(true);
  });

  it('should render only icons and an aria-label for the icon-only variant', () => {
    fixture.componentRef.setInput('buttons', [
      { id: 'bold', label: 'Bold', icon: 'B' },
    ]);
    fixture.componentRef.setInput('options', { variant: 'icon-only' });
    fixture.detectChanges();

    const button = buttons()[0];

    expect(button.querySelector('span[aria-hidden="true"]')?.textContent).toBe(
      'B',
    );
    expect(button.getAttribute('aria-label')).toBe('Bold');
    expect(button.textContent?.trim()).toBe('B');
  });

  it('should render a count pill when a button has a count', () => {
    fixture.componentRef.setInput('buttons', [
      { id: 'inbox', label: 'Inbox', count: 12 },
    ]);
    fixture.detectChanges();

    const pill = buttons()[0].querySelector('span[data-role="count"]');

    expect(pill?.textContent?.trim()).toBe('12');
    expect(pill?.className).toContain('smart:rounded-full');
    expect(pill?.className).toContain('smart:bg-gray-100');
  });

  it('should style the count pill with the stat palette for the with-stat variant', () => {
    fixture.componentRef.setInput('buttons', [
      { id: 'inbox', label: 'Inbox', count: 12 },
    ]);
    fixture.componentRef.setInput('options', { variant: 'with-stat' });
    fixture.detectChanges();

    const pill = buttons()[0].querySelector('span[data-role="count"]');

    expect(pill?.className).toContain('smart:bg-blue-100');
  });

  it('should emit buttonClick and update selected when a button is clicked', () => {
    let emitted: { buttonId: string } | undefined;
    component.buttonClick.subscribe((e) => (emitted = e));

    buttons()[2].click();
    fixture.detectChanges();

    expect(emitted).toEqual({ buttonId: 'date' });
    expect(component.selected()).toBe('date');
  });

  it('should apply cssClass on the group (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    expect(group().className).toContain('my-extra-class');
  });
});
