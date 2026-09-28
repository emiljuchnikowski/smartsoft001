import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionHeadingUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: SectionHeadingUsageExampleComponent', () => {
  let fixture: ComponentFixture<SectionHeadingUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionHeadingUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionHeadingUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the heading from the options', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('h3')?.textContent).toContain('Team members');
    expect(element.textContent).toContain(
      'People who can access this project.',
    );
  });

  it('should run the handler from the projected actions template', () => {
    const action: HTMLButtonElement =
      fixture.nativeElement.querySelector('.actions button');

    action.click();

    expect(fixture.componentInstance.invited()).toBe(true);
  });
});
