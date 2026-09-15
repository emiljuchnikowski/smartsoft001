import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarLayoutCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: SidebarLayoutCustomExampleComponent', () => {
  let fixture: ComponentFixture<SidebarLayoutCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarLayoutCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarLayoutCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom layout through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector('smart-sidebar-layout docs-custom-sidebar-layout'),
    ).toBeTruthy();
    expect(element.querySelector('smart-sidebar-layout-standard')).toBeNull();
  });

  it('should render the sidebar template supplied through the options', () => {
    const links = element.querySelectorAll('.docs-sidebar-layout__sidebar a');

    expect(links).toHaveLength(3);
    expect(links[0].textContent).toContain('Overview');
  });

  it('should fall back to the title when no header template is given', () => {
    expect(
      element.querySelector('.docs-sidebar-layout__title')?.textContent,
    ).toContain('Dashboard');
  });

  it('should expose the sidebar position from the options', () => {
    expect(
      element
        .querySelector('.docs-sidebar-layout')
        ?.getAttribute('data-position'),
    ).toBe('left');
  });
});
