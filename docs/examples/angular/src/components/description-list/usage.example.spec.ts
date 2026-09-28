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
    const list: HTMLElement = fixture.nativeElement;

    expect(list.querySelector('h3')?.textContent).toContain(
      'Applicant information',
    );
    expect(list.querySelector('dt')?.textContent).toContain('Full name');
    expect(list.querySelector('dd')?.textContent).toContain('Margot Foster');
  });

  it('should run the handler from the item action template', () => {
    const action: HTMLButtonElement =
      fixture.nativeElement.querySelector('.action button');

    action.click();

    expect(fixture.componentInstance.editedField()).toBe('email');
  });
});
