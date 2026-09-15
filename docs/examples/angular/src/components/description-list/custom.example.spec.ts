import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionListCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: DescriptionListCustomExampleComponent', () => {
  let fixture: ComponentFixture<DescriptionListCustomExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionListCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DescriptionListCustomExampleComponent);
    fixture.detectChanges();
  });

  it('should render the custom list instead of the standard one', () => {
    const custom = fixture.nativeElement.querySelector(
      '.docs-description-list',
    );
    const standard = fixture.nativeElement.querySelector(
      'smart-description-list-standard',
    );

    expect(custom).toBeTruthy();
    expect(standard).toBeNull();
  });

  it('should render one term/definition pair per item', () => {
    const terms = fixture.nativeElement.querySelectorAll('dt');
    const definitions = fixture.nativeElement.querySelectorAll('dd');

    expect(terms).toHaveLength(3);
    expect(definitions[0].textContent).toContain('Margot Foster');
  });

  it('should render the title from the options', () => {
    const title = fixture.nativeElement.querySelector(
      '.docs-description-list__title',
    );

    expect(title.textContent).toContain('Applicant information');
  });
});
