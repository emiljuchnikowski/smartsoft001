import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: DetailsCustomExampleComponent', () => {
  let fixture: ComponentFixture<DetailsCustomExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsCustomExampleComponent);
    fixture.detectChanges();
  });

  it('should render the custom details instead of the standard one', () => {
    const custom = fixture.nativeElement.querySelector('.docs-details');
    const standard = fixture.nativeElement.querySelector(
      'smart-details-standard',
    );

    expect(custom).toBeTruthy();
    expect(standard).toBeNull();
  });

  it('should render one row per field declared with details metadata', () => {
    const rows = fixture.nativeElement.querySelectorAll('.docs-details__row');

    expect(rows).toHaveLength(2);
  });

  it('should read each value off the item under the field key', () => {
    const values = fixture.nativeElement.querySelectorAll('dd');

    expect(values[0].textContent).toContain('Margot Foster');
    expect(values[1].textContent).toContain('Backend Developer');
  });
});
