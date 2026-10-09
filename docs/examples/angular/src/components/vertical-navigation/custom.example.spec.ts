import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalNavigationCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: VerticalNavigationCustomExampleComponent', () => {
  let fixture: ComponentFixture<VerticalNavigationCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalNavigationCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerticalNavigationCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom navigation through the wrapper instead of the standard one', () => {
    // Assert
    expect(
      element.querySelector(
        'smart-vertical-navigation docs-custom-vertical-navigation',
      ),
    ).toBeTruthy();
    expect(
      element.querySelector('smart-vertical-navigation-standard'),
    ).toBeNull();
    expect(element.querySelector('.docs-vertical-nav')?.className).toContain(
      'docs-vertical-nav--with-badges',
    );
  });

  it('should render the loose items and the titled group the base normalizes', () => {
    // Act
    const groups = element.querySelectorAll('.docs-vertical-nav__group');
    const current = element.querySelector('.docs-vertical-nav__item--current');

    // Assert
    expect(groups.length).toBe(2);
    expect(
      groups[1].querySelector('.docs-vertical-nav__group-title')?.textContent,
    ).toContain('Projects');
    expect(current?.textContent).toContain('Team');
    expect(current?.querySelector('a')?.getAttribute('aria-current')).toBe(
      'page',
    );
  });

  it('should show the item reported through the wrapper itemClick', () => {
    // Arrange
    const button = element.querySelector(
      '.docs-vertical-nav__item button',
    ) as HTMLButtonElement;

    // Act
    button.click();
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.lastItem()).toBe('new-project');
    expect(element.textContent).toContain('Last clicked item: new-project');
  });
});
