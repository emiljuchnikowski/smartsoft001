import { Provider } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideSmartPresets } from '@smartsoft001/angular';

import { DividerUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: DividerUsageExampleComponent', () => {
  let fixture: ComponentFixture<DividerUsageExampleComponent>;

  async function setup(providers: Provider[] = []) {
    await TestBed.configureTestingModule({
      imports: [DividerUsageExampleComponent],
      providers,
    }).compileComponents();

    fixture = TestBed.createComponent(DividerUsageExampleComponent);
    fixture.detectChanges();
  }

  it('should render the title and the action label', async () => {
    // Arrange
    await setup();
    const divider: HTMLElement = fixture.nativeElement;

    // Assert
    expect(divider.querySelector('h3')?.textContent).toContain('Team members');
    expect(divider.querySelector('button')?.textContent).toContain(
      'Add member',
    );
  });

  it('should count the clicks on the action', async () => {
    // Arrange
    await setup();
    const action: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    // Act
    action.click();
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.textContent).toContain('Add member clicks: 1');
  });

  it('should draw the title, a line and the action in one row with the presets', async () => {
    // Arrange
    await setup([provideSmartPresets()]);
    const separator: HTMLElement =
      fixture.nativeElement.querySelector('[role="separator"]');

    // Assert
    expect(separator.querySelector('span')?.textContent).toContain(
      'Team members',
    );
    expect(separator.querySelector('button')?.textContent).toContain(
      'Add member',
    );
  });
});
