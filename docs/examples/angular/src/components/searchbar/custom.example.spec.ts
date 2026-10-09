import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchbarCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: SearchbarCustomExampleComponent', () => {
  let fixture: ComponentFixture<SearchbarCustomExampleComponent>;
  let component: SearchbarCustomExampleComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchbarCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchbarCustomExampleComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function input(): HTMLInputElement | null {
    return element.querySelector<HTMLInputElement>('.docs-searchbar__input');
  }

  it('should render the custom searchbar through the wrapper instead of the standard one', () => {
    // Assert
    expect(
      element.querySelector('smart-searchbar docs-custom-searchbar'),
    ).toBeTruthy();
    expect(element.querySelector('smart-searchbar-standard')).toBeNull();
  });

  it('should render the input with the placeholder and label from the options', () => {
    // Act
    const field = input();

    // Assert
    expect(field?.placeholder).toBe('Search invoices');
    expect(field?.getAttribute('aria-label')).toBe('Search invoices');
    expect(field?.value).toBe('');
  });

  it('should push the text coming from the wrapper into the form control', () => {
    // Arrange
    component.text.set('invoice');

    // Act
    fixture.detectChanges();

    // Assert
    expect(input()?.value).toBe('invoice');
  });

  it('should report the typed text back through the wrapper once the debounce settles', () => {
    // Arrange
    jest.useFakeTimers();
    const field = input() as HTMLInputElement;
    field.value = 'invoice';
    field.dispatchEvent(new Event('input'));

    // Act
    jest.advanceTimersByTime(300);
    fixture.detectChanges();

    // Assert
    expect(component.text()).toBe('invoice');
    expect(element.textContent).toContain('Results for "invoice"');
  });

  it('should hide the empty input on blur and bring it back through the toggle button', () => {
    // Arrange
    input()?.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(input()).toBeNull();
    expect(component.show()).toBe(false);

    // Act
    element
      .querySelector<HTMLButtonElement>('.docs-searchbar__toggle')
      ?.click();
    fixture.detectChanges();

    // Assert
    expect(input()).toBeTruthy();
    expect(component.show()).toBe(true);
  });
});
