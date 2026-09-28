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
    const card: HTMLElement = fixture.nativeElement;

    expect(card.querySelector('h3')?.textContent).toContain('Team members');
  });

  it('should project the body and footer content', () => {
    const card: HTMLElement = fixture.nativeElement;

    expect(card.textContent).toContain('4 of 10 seats used');
    expect(card.textContent).toContain('Invite member');
  });
});
