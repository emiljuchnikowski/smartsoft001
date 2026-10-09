import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: TabsCustomExampleComponent', () => {
  let fixture: ComponentFixture<TabsCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom tabs through the wrapper instead of the standard one', () => {
    // Assert
    expect(element.querySelector('smart-tabs docs-custom-tabs')).toBeTruthy();
    expect(element.querySelector('smart-tabs-standard')).toBeNull();
  });

  it('should mark the forwarded selectedId as the current tab', () => {
    // Act
    const current = element.querySelector('.docs-tabs__tab--current');

    // Assert
    expect(current?.textContent).toContain('Billing');
    expect(current?.getAttribute('aria-current')).toBe('page');
  });

  it('should report a clicked tab through the wrapper tabChange and [(selectedId)]', () => {
    // Arrange
    const buttons =
      element.querySelectorAll<HTMLButtonElement>('.docs-tabs__tab');

    // Act
    buttons[2].click();
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Last chosen tab: members');
    expect(fixture.componentInstance.selectedId()).toBe('members');
    expect(
      element.querySelector('.docs-tabs__tab--current')?.textContent,
    ).toContain('Members');
  });
});
