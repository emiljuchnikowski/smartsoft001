import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarLayoutUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: SidebarLayoutUsageExampleComponent', () => {
  let fixture: ComponentFixture<SidebarLayoutUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarLayoutUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarLayoutUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the sidebar template from the options', () => {
    const aside: HTMLElement = fixture.nativeElement.querySelector('aside');

    expect(aside.textContent).toContain('Projects');
  });

  it('should project the page content into the main area', () => {
    const main: HTMLElement = fixture.nativeElement.querySelector('main');

    expect(main.textContent).toContain('Dashboard');
  });
});
