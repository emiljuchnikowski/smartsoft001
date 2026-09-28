import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbsUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: BreadcrumbsUsageExampleComponent', () => {
  let fixture: ComponentFixture<BreadcrumbsUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbsUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbsUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the trail from the options', () => {
    const nav: HTMLElement = fixture.nativeElement.querySelector('nav');

    expect(nav.textContent).toContain('Projects');
    expect(nav.textContent).toContain('Project Nero');
    expect(nav.querySelector('[aria-current="page"]')?.textContent).toContain(
      'Project Nero',
    );
  });

  it('should hand the clicked item id to the handler', () => {
    const projects: HTMLButtonElement =
      fixture.nativeElement.querySelectorAll('nav button')[1];

    projects.click();

    expect(fixture.componentInstance.lastItemId()).toBe('projects');
  });
});
