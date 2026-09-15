import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMenuCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: SelectMenuCustomExampleComponent', () => {
  let fixture: ComponentFixture<SelectMenuCustomExampleComponent>;
  let element: HTMLElement;

  const open = (): void => {
    element
      .querySelector<HTMLButtonElement>('.docs-select-menu__trigger')
      ?.click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMenuCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectMenuCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom select menu through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector('smart-select-menu docs-custom-select-menu'),
    ).toBeTruthy();
    expect(element.querySelector('smart-select-menu-standard')).toBeNull();
  });

  it('should show the placeholder until something is selected', () => {
    expect(
      element.querySelector('.docs-select-menu__trigger')?.textContent,
    ).toContain('Choose a country');
    expect(element.querySelector('[role="listbox"]')).toBeNull();
  });

  it('should list every item from the options once opened', () => {
    open();

    expect(element.querySelectorAll('[role="option"]')).toHaveLength(3);
  });

  it('should select an item through the base class and close the list', () => {
    open();

    element.querySelectorAll<HTMLElement>('[role="option"]')[1].click();
    fixture.detectChanges();

    expect(
      element.querySelector('.docs-select-menu__trigger')?.textContent,
    ).toContain('Germany');
    expect(element.querySelector('[role="listbox"]')).toBeNull();
  });
});
