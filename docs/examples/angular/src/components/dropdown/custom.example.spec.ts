import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: DropdownCustomExampleComponent', () => {
  let fixture: ComponentFixture<DropdownCustomExampleComponent>;
  let element: HTMLElement;

  const trigger = () =>
    element.querySelector<HTMLButtonElement>('.docs-dropdown__trigger');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom dropdown through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector('smart-dropdown docs-custom-dropdown'),
    ).toBeTruthy();
    expect(element.querySelector('smart-dropdown-standard')).toBeNull();
    expect(trigger()?.textContent).toContain('Actions');
  });

  it('should keep the menu closed until the trigger is clicked', () => {
    expect(element.querySelector('.docs-dropdown__menu')).toBeNull();

    trigger()?.click();
    fixture.detectChanges();

    expect(element.querySelectorAll('.docs-dropdown__item')).toHaveLength(2);
  });

  it('should re-emit the selected item on the wrapper and close the menu', () => {
    // Arrange
    trigger()?.click();
    fixture.detectChanges();

    // Act
    element.querySelector<HTMLButtonElement>('.docs-dropdown__item')?.click();
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.selectedId()).toBe('newsletter');
    expect(element.querySelector('.docs-dropdown__menu')).toBeNull();
  });
});
