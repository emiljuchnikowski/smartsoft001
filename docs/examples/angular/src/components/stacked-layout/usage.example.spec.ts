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

  it('should render the navigation and header templates from the options', () => {
    const layout: HTMLElement = fixture.nativeElement;

    expect(layout.querySelector('nav')?.textContent).toContain('Dashboard');
    expect(layout.querySelector('header h1')?.textContent).toContain(
      'Projects',
    );
  });

  it('should project the page content into the main area', () => {
    const main: HTMLElement = fixture.nativeElement.querySelector('main');

    expect(main.textContent).toContain('3 active projects');
  });
});
