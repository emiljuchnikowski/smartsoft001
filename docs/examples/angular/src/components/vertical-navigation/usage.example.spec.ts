import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalNavigationUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: VerticalNavigationUsageExampleComponent', () => {
  let fixture: ComponentFixture<VerticalNavigationUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalNavigationUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerticalNavigationUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the items from the options and mark the current one', () => {
    const nav: HTMLElement = fixture.nativeElement.querySelector('nav');

    expect(nav.getAttribute('aria-label')).toBe('Main');
    expect(nav.textContent).toContain('Projects');
    expect(nav.textContent).toContain('12');
    expect(nav.querySelector('[aria-current="page"]')?.textContent).toContain(
      'Dashboard',
    );
  });

  it('should hand the clicked item id to the handler', () => {
    const items: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('nav button');

    items[1].click();

    expect(fixture.componentInstance.lastItem()).toBe('team');
  });
});
