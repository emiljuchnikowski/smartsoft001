import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStateCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: EmptyStateCustomExampleComponent', () => {
  let fixture: ComponentFixture<EmptyStateCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom empty state through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector('smart-empty-state docs-custom-empty-state'),
    ).toBeTruthy();
    expect(element.querySelector('smart-empty-state-standard')).toBeNull();
    expect(
      element.querySelector('.docs-empty-state__title')?.textContent,
    ).toContain('No draft invoices');
    expect(
      element.querySelector('.docs-empty-state__description')?.textContent,
    ).toContain('Draft an invoice and send it to a customer.');
  });

  it('should render one button per action from the options', () => {
    const actions = element.querySelectorAll('.docs-empty-state__action');

    expect(actions).toHaveLength(2);
    expect(actions[0]?.textContent).toContain('Create a new invoice');
  });

  it('should re-emit the clicked action id on the wrapper', () => {
    // Act
    element
      .querySelector<HTMLButtonElement>('.docs-empty-state__action')
      ?.click();

    // Assert
    expect(fixture.componentInstance.lastAction()).toBe('create');
  });
});
