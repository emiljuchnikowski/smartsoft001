import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: AccordionCustomExampleComponent', () => {
  let fixture: ComponentFixture<AccordionCustomExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccordionCustomExampleComponent);
    fixture.detectChanges();
  });

  it('should render the custom accordion implementation with the projected header', () => {
    const accordion = fixture.nativeElement.querySelector('.docs-accordion');

    expect(accordion).not.toBeNull();
    expect(accordion.textContent).toContain('Switzerland');
  });

  it('should reveal the body when the custom header button is clicked', () => {
    const header: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.docs-accordion__header',
    );

    expect(
      fixture.nativeElement.querySelector('.docs-accordion__body'),
    ).toBeNull();

    header.click();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.docs-accordion__body').textContent,
    ).toContain('the flag is a big plus');
  });
});
