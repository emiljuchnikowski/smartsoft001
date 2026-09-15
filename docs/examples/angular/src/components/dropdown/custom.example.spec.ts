import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  CustomDropdownComponent,
  DropdownCustomExampleComponent,
} from './custom.example';

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

  // The wrapper's (selectedItem) never fires for a custom implementation,
  // because NgComponentOutlet forwards inputs only - the output is emitted by
  // the custom component itself.
  it('should emit the selected item and close the menu', () => {
    const custom = fixture.debugElement.query(
      By.directive(CustomDropdownComponent),
    ).componentInstance as CustomDropdownComponent;
    const selected: string[] = [];
    custom.selectedItem.subscribe((event) => selected.push(event.itemId));

    trigger()?.click();
    fixture.detectChanges();
    element.querySelector<HTMLButtonElement>('.docs-dropdown__item')?.click();
    fixture.detectChanges();

    expect(selected).toEqual(['newsletter']);
    expect(element.querySelector('.docs-dropdown__menu')).toBeNull();
  });
});
