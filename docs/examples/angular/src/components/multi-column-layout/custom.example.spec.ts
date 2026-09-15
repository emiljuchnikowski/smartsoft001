import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiColumnLayoutCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: MultiColumnLayoutCustomExampleComponent', () => {
  let fixture: ComponentFixture<MultiColumnLayoutCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiColumnLayoutCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiColumnLayoutCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom layout through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector(
        'smart-multi-column-layout docs-custom-multi-column-layout',
      ),
    ).toBeTruthy();
    expect(
      element.querySelector('smart-multi-column-layout-standard'),
    ).toBeNull();
  });

  it('should render the title and the template slots taken from the options', () => {
    expect(
      element.querySelector('.docs-multi-column-layout__title')?.textContent,
    ).toContain('Inbox');
    expect(
      element.querySelector('.docs-multi-column-layout__header')?.textContent,
    ).toContain('Unread first');
    expect(
      element.querySelector('.docs-multi-column-layout__nav')?.textContent,
    ).toContain('Drafts');
    expect(
      element.querySelector('.docs-multi-column-layout__secondary')
        ?.textContent,
    ).toContain('Storage');
  });

  it('should turn the widths from the options into modifier classes', () => {
    const container = element.querySelector('.docs-multi-column-layout');

    expect(container?.classList).toContain('docs-multi-column-layout--full');
    expect(container?.classList).toContain(
      'docs-multi-column-layout--secondary-sm',
    );
  });
});
