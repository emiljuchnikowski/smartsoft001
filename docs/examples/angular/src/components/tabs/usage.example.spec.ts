import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: TabsUsageExampleComponent', () => {
  let fixture: ComponentFixture<TabsUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsUsageExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  function tabs(): NodeListOf<HTMLButtonElement> {
    return element.querySelectorAll('nav button');
  }

  it('should render the tabs from the options and mark the selected one', () => {
    // Act
    const current = element.querySelector('nav button[aria-current="page"]');

    // Assert
    expect(element.querySelector('nav')?.getAttribute('aria-label')).toBe(
      'Account settings',
    );
    expect(tabs()[2].textContent).toContain('Team members');
    expect(tabs()[2].textContent).toContain('4');
    expect(current?.textContent).toContain('My account');
  });

  it('should show the chosen tab and move the selection to it', () => {
    // Act
    tabs()[2].click();
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Last chosen tab: team');
    expect(
      element.querySelector('nav button[aria-current="page"]')?.textContent,
    ).toContain('Team members');
    expect(fixture.componentInstance.selectedTab()).toBe('team');
  });
});
