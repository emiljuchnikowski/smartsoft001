import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: DropdownUsageExampleComponent', () => {
  let fixture: ComponentFixture<DropdownUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownUsageExampleComponent);
    fixture.detectChanges();
  });

  function openMenu(): void {
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.smart-dropdown-trigger',
    );
    trigger.click();
    fixture.detectChanges();
  }

  it('should render the projected trigger label', () => {
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.smart-dropdown-trigger',
    );

    expect(trigger.textContent).toContain('Options');
  });

  it('should render the header and the items when opened', () => {
    openMenu();

    const menu: HTMLElement =
      fixture.nativeElement.querySelector('[role="menu"]');
    expect(menu.textContent).toContain('Signed in as tom@example.com');
    expect(menu.textContent).toContain('Account settings');
  });

  it('should hand the selected item id to the handler', () => {
    openMenu();
    const item: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[role="menuitem"] button',
    );

    item.click();

    expect(fixture.componentInstance.selectedId()).toBe('settings');
  });
});
