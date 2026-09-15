import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionHeadingCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: SectionHeadingCustomExampleComponent', () => {
  let fixture: ComponentFixture<SectionHeadingCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionHeadingCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionHeadingCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom heading through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector(
        'smart-section-heading docs-custom-section-heading',
      ),
    ).toBeTruthy();
    expect(element.querySelector('smart-section-heading-standard')).toBeNull();
  });

  it('should render the title, the eyebrow label and the description from the options', () => {
    expect(
      element.querySelector('.docs-section-heading__title')?.textContent,
    ).toContain('Manage your team in one place');
    expect(
      element.querySelector('.docs-section-heading__label')?.textContent,
    ).toContain('New');
    expect(
      element.querySelector('.docs-section-heading__description')?.textContent,
    ).toContain('A balanced two-column split');
  });

  it('should render the actions template supplied through the options', () => {
    const action = element.querySelector('.docs-section-heading__actions a');

    expect(action?.textContent).toContain('Get started');
  });
});
