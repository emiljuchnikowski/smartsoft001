import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHeadingUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: CardHeadingUsageExampleComponent', () => {
  let fixture: ComponentFixture<CardHeadingUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardHeadingUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardHeadingUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the title and description from the options', () => {
    const heading: HTMLElement = fixture.nativeElement;

    expect(heading.querySelector('h3')?.textContent).toContain('Job postings');
    expect(heading.textContent).toContain('Open roles across all teams');
  });

  it('should run the handler from the projected actions template', () => {
    const action: HTMLButtonElement =
      fixture.nativeElement.querySelector('.actions button');

    action.click();

    expect(fixture.componentInstance.createdCount()).toBe(1);
  });
});
