import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionListUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: DescriptionListUsageExampleComponent', () => {
  let fixture: ComponentFixture<DescriptionListUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionListUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DescriptionListUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the title and items from the options', () => {
    // Arrange
    const list: HTMLElement = fixture.nativeElement;

    // Assert
    expect(list.querySelector('h3')?.textContent).toContain(
      'Applicant information',
    );
    expect(list.querySelector('dt')?.textContent).toContain('Full name');
    expect(list.querySelector('dd')?.textContent).toContain('Margot Foster');
  });

  it('should show the field edited through the item action', () => {
    // Arrange
    const action: HTMLButtonElement =
      fixture.nativeElement.querySelector('.action button');

    // Act
    action.click();
    fixture.detectChanges();

    // Assert
    expect(action.textContent).toContain('Update');
    expect(fixture.nativeElement.textContent).toContain('Editing: email');
  });
});
