import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: CardUsageExampleComponent', () => {
  let fixture: ComponentFixture<CardUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the title from the options', () => {
    // Act
    const card: HTMLElement = fixture.nativeElement;

    // Assert
    expect(card.querySelector('h3')?.textContent).toContain('Team members');
  });

  it('should project the body and footer content', () => {
    // Act
    const card: HTMLElement = fixture.nativeElement;

    // Assert
    expect(card.textContent).toContain('4 of 10 seats used');
    expect(card.querySelector('smart-button button')?.textContent).toContain(
      'Invite member',
    );
  });

  it('should count the invited member in the body', () => {
    // Arrange
    const invite: HTMLButtonElement = fixture.nativeElement.querySelector(
      'smart-button button',
    );

    // Act
    invite.click();
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.textContent).toContain('5 of 10 seats used');
  });
});
