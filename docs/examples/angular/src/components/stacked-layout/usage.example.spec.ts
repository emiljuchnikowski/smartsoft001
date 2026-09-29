import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedLayoutUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: StackedLayoutUsageExampleComponent', () => {
  let fixture: ComponentFixture<StackedLayoutUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackedLayoutUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StackedLayoutUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the navigation template and the title from the options', () => {
    const layout: HTMLElement = fixture.nativeElement;

    expect(layout.querySelector('nav')?.textContent).toContain('Dashboard');
    expect(
      layout.querySelector('header h1[data-role="title"]')?.textContent,
    ).toContain('Projects');
  });

  it('should expose the container width on the layout root', () => {
    const root = fixture.nativeElement.querySelector('[data-container-width]');

    expect(root.getAttribute('data-container-width')).toBe('xl');
  });

  it('should project the page content into the main area', () => {
    const main: HTMLElement = fixture.nativeElement.querySelector('main');

    expect(main.textContent).toContain('3 active projects');
  });
});
