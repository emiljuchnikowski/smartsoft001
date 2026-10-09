import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalNavigationUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: VerticalNavigationUsageExampleComponent', () => {
  let fixture: ComponentFixture<VerticalNavigationUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalNavigationUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerticalNavigationUsageExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the items from the options and mark the current one', () => {
    // Act
    const nav = element.querySelector('nav') as HTMLElement;

    // Assert
    expect(nav.getAttribute('aria-label')).toBe('Main');
    expect(nav.textContent).toContain('Projects');
    expect(nav.textContent).toContain('12');
    expect(nav.querySelector('[aria-current="page"]')?.textContent).toContain(
      'Dashboard',
    );
  });

  it('should show the clicked item reported through itemClick', () => {
    // Arrange
    const items = element.querySelectorAll<HTMLButtonElement>('nav button');

    // Act
    items[1].click();
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.lastItem()).toBe('team');
    expect(element.textContent).toContain('Last clicked item: team');
  });
});
