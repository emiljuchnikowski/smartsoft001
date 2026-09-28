import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandPaletteUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: CommandPaletteUsageExampleComponent', () => {
  let fixture: ComponentFixture<CommandPaletteUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandPaletteUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommandPaletteUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the commands and placeholder from the inputs', () => {
    const palette: HTMLElement = fixture.nativeElement;

    expect(palette.textContent).toContain('New project');
    expect(
      palette
        .querySelector('input[type="search"]')
        ?.getAttribute('placeholder'),
    ).toBe('Search commands...');
  });

  it('should open the palette from the trigger button', () => {
    const trigger: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    trigger.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(true);
  });

  it('should hand the selected command id to the handler and close', () => {
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    const option: HTMLElement =
      fixture.nativeElement.querySelector('li[role="option"]');

    option.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.lastCommand()).toBe('new-project');
    expect(fixture.componentInstance.open()).toBe(false);
  });
});
