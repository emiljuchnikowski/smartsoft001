import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: AccordionUsageExampleComponent', () => {
  let fixture: ComponentFixture<AccordionUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccordionUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the projected header and keep the body collapsed', () => {
    const accordion: HTMLElement = fixture.nativeElement;

    expect(accordion.textContent).toContain('What is your refund policy?');
    expect(accordion.textContent).not.toContain('within 30 days');
  });

  it('should expand the body and update the bound signal when the header is clicked', () => {
    const header: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    header.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('within 30 days');
  });
});
