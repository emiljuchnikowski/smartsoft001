import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandPaletteUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: CommandPaletteUsageExampleComponent', () => {
  let fixture: ComponentFixture<CommandPaletteUsageExampleComponent>;
  let element: HTMLElement;

  const dialog = (): HTMLDialogElement =>
    element.querySelector('dialog') as HTMLDialogElement;

  const clickTrigger = (): void => {
    (element.querySelector('smart-button button') as HTMLButtonElement).click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandPaletteUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommandPaletteUsageExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the commands and the search texts from the options', () => {
    // Act
    const search = element.querySelector('input[type="search"]');

    // Assert
    expect(dialog().textContent).toContain('New project');
    expect(search?.getAttribute('placeholder')).toBe('Search commands...');
    expect(search?.getAttribute('aria-label')).toBe('Search commands');
  });

  it('should keep the palette closed until the trigger is clicked', () => {
    // Arrange
    expect(dialog().hasAttribute('open')).toBe(false);

    // Act
    clickTrigger();

    // Assert
    expect(dialog().hasAttribute('open')).toBe(true);
  });

  it('should narrow the commands down to the query', () => {
    // Arrange
    const search = element.querySelector(
      'input[type="search"]',
    ) as HTMLInputElement;

    // Act
    search.value = 'settings';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Assert
    const options = dialog().querySelectorAll('[role="option"]');
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toContain('Open settings');
  });

  it('should show the selected command and close the palette', () => {
    // Arrange
    clickTrigger();
    const option = element.querySelector('li[role="option"]') as HTMLElement;

    // Act
    option.click();
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Last command: new-project');
    expect(dialog().hasAttribute('open')).toBe(false);
  });
});
