import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHeadingCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: CardHeadingCustomExampleComponent', () => {
  let fixture: ComponentFixture<CardHeadingCustomExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardHeadingCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardHeadingCustomExampleComponent);
    fixture.detectChanges();
  });

  it('should render the custom heading instead of the standard one', () => {
    const custom = fixture.nativeElement.querySelector('.docs-card-heading');
    const standard = fixture.nativeElement.querySelector(
      'smart-card-heading-standard',
    );

    expect(custom).toBeTruthy();
    expect(standard).toBeNull();
  });

  it('should render the title and description from the options', () => {
    const title = fixture.nativeElement.querySelector(
      '.docs-card-heading__title',
    );
    const description = fixture.nativeElement.querySelector(
      '.docs-card-heading__description',
    );

    expect(title.textContent).toContain('Applicant information');
    expect(description.textContent).toContain('Personal details');
  });

  it('should append the class forwarded through the wrapper', () => {
    const custom: HTMLElement =
      fixture.nativeElement.querySelector('.docs-card-heading');

    expect(custom.classList).toContain('docs-card-heading--demo');
  });
});
