import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: NavbarUsageExampleComponent', () => {
  let fixture: ComponentFixture<NavbarUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarUsageExampleComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should render the logo and items from the options', () => {
    expect(element.querySelector('.logo img')?.getAttribute('alt')).toBe(
      'Acme',
    );
    expect(element.querySelector('.items')?.textContent).toContain('Dashboard');
    expect(element.querySelector('.items')?.textContent).toContain('Projects');
  });

  it('should hand the clicked item id to the handler', () => {
    const projects = Array.from(
      element.querySelectorAll<HTMLButtonElement>('.items .item-button'),
    ).find((button) => button.textContent?.includes('Projects'));

    projects?.click();

    expect(fixture.componentInstance.activeItem()).toBe('projects');
  });
});
