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

  it('should render the custom searchbar through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector('smart-searchbar docs-custom-searchbar'),
    ).toBeTruthy();
    expect(element.querySelector('smart-searchbar-standard')).toBeNull();
  });

  it('should render the input with the placeholder from the options', () => {
    const input = element.querySelector<HTMLInputElement>(
      '.docs-searchbar__input',
    );

    expect(input?.placeholder).toBe('Search invoices');
    expect(input?.value).toBe('');
  });

  it('should push the text coming from the wrapper into the form control', () => {
    component.text.set('invoice');
    fixture.detectChanges();

    const input = element.querySelector<HTMLInputElement>(
      '.docs-searchbar__input',
    );

    expect(input?.value).toBe('invoice');
  });

  it('should hide the empty input on blur and bring it back through the toggle button', () => {
    element
      .querySelector<HTMLInputElement>('.docs-searchbar__input')
      ?.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(element.querySelector('.docs-searchbar__input')).toBeNull();

    element
      .querySelector<HTMLButtonElement>('.docs-searchbar__toggle')
      ?.click();
    fixture.detectChanges();

    expect(element.querySelector('.docs-searchbar__input')).toBeTruthy();
  });
});
