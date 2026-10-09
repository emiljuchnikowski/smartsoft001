import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: CardCustomExampleComponent', () => {
  let fixture: ComponentFixture<CardCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should render the custom card through <smart-card> instead of the standard one', () => {
    // Act
    const card = element.querySelector('smart-card article.docs-card');

    // Assert
    expect(card).not.toBeNull();
    expect(card?.querySelector('h3')?.textContent).toContain('Billing');
    expect(element.querySelector('smart-card-standard')).toBeNull();
  });

  it('should render the projected body and footer from the templates', () => {
    // Act
    const body = element.querySelector('.docs-card__body');
    const footer = element.querySelector('.docs-card__footer');

    // Assert
    expect(body?.textContent).toContain('Pro plan, billed monthly.');
    expect(footer?.textContent).toContain('Next invoice on 1 May');
  });
});
