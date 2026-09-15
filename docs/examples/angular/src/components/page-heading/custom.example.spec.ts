import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeadingCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: PageHeadingCustomExampleComponent', () => {
  let fixture: ComponentFixture<PageHeadingCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeadingCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeadingCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom page heading through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector('smart-page-heading docs-custom-page-heading'),
    ).toBeTruthy();
    expect(element.querySelector('smart-page-heading-standard')).toBeNull();
  });

  it('should render the title and subtitle taken from the options', () => {
    expect(
      element.querySelector('.docs-page-heading__title')?.textContent,
    ).toContain('Back End Developer');
    expect(
      element.querySelector('.docs-page-heading__subtitle')?.textContent,
    ).toContain('Full-time');
  });

  it('should render the breadcrumbs and actions template slots', () => {
    expect(
      element.querySelector('.docs-page-heading__breadcrumbs')?.textContent,
    ).toContain('Jobs');
    expect(
      element.querySelector('.docs-page-heading__actions')?.textContent,
    ).toContain('Publish');
  });

  it('should turn the presentation layout into a modifier class', () => {
    const container = element.querySelector('.docs-page-heading');

    expect(container?.classList).toContain('docs-page-heading--links-right');
  });
});
