import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandPaletteCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: CommandPaletteCustomExampleComponent', () => {
  let fixture: ComponentFixture<CommandPaletteCustomExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandPaletteCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommandPaletteCustomExampleComponent);
    fixture.detectChanges();
  });

  it('should render the custom palette instead of the standard one', () => {
    const custom = fixture.nativeElement.querySelector('.docs-command-palette');
    const standard = fixture.nativeElement.querySelector(
      'smart-command-palette-standard',
    );

    expect(custom).toBeTruthy();
    expect(standard).toBeNull();
  });

  it('should list every command while the query is empty', () => {
    const options = fixture.nativeElement.querySelectorAll('[role="option"]');

    expect(options).toHaveLength(3);
  });

  it('should narrow the list down to the commands matching the query', () => {
    const search: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[type="search"]',
    );

    search.value = 'theme';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toContain('Toggle theme');
  });
});
