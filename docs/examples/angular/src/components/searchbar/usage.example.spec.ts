import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { SearchbarUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: SearchbarUsageExampleComponent', () => {
  let fixture: ComponentFixture<SearchbarUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    jest.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [SearchbarUsageExampleComponent],
      // The app provides translations once, in app.config.ts.
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchbarUsageExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function searchInput(): HTMLInputElement | null {
    return element.querySelector('input[type="search"]');
  }

  function type(value: string): void {
    const input = searchInput() as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  it('should render the input with the placeholder from the options', () => {
    // Act
    const input = searchInput();

    // Assert
    expect(input?.placeholder).toBe('Search orders');
  });

  it('should show the typed text once the debounce settles', () => {
    // Arrange
    type('invoice');

    // Act
    jest.advanceTimersByTime(300);
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Results for "invoice"');
  });

  it('should not report the text before the debounce settles', () => {
    // Arrange
    type('invoice');

    // Act
    jest.advanceTimersByTime(299);
    fixture.detectChanges();

    // Assert
    expect(element.textContent).not.toContain('Results for');
  });

  it('should collapse to the toggle button on blur while empty', () => {
    // Arrange
    (searchInput() as HTMLInputElement).dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(searchInput()).toBeNull();

    // Act
    (element.querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();

    // Assert
    expect(searchInput()?.placeholder).toBe('Search orders');
  });
});
