import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarNavigationUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: SidebarNavigationUsageExampleComponent', () => {
  let fixture: ComponentFixture<SidebarNavigationUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarNavigationUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarNavigationUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the items from the options', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Dashboard');
    expect(element.textContent).toContain('Reports');
  });

  it('should hand the clicked item id to the handler', () => {
    const item: HTMLButtonElement =
      fixture.nativeElement.querySelector('.item-button');

    item.click();

    expect(fixture.componentInstance.activeItem()).toBe('dashboard');
  });

  it('should hand the toggled item to the handler', () => {
    const toggle: HTMLButtonElement =
      fixture.nativeElement.querySelector('.item-toggle');

    toggle.click();

    expect(fixture.componentInstance.expandedItem()).toBe('reports');
  });
});
