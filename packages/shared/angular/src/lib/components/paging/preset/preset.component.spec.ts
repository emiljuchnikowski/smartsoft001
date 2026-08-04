import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagingPresetComponent } from './preset.component';

describe('@smartsoft001/shared-angular: PagingPresetComponent', () => {
  let fixture: ComponentFixture<PagingPresetComponent>;
  let component: PagingPresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagingPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PagingPresetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 3);
    fixture.detectChanges();
  });

  function nav(): HTMLElement {
    return fixture.nativeElement.querySelector('nav');
  }

  function pageButtons(): HTMLButtonElement[] {
    return Array.from(
      nav().querySelectorAll<HTMLButtonElement>('button[data-role="page"]'),
    );
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(PagingPresetComponent);
  });

  it('should render one button per page', () => {
    expect(pageButtons()).toHaveLength(3);
  });

  it('should mark the current page with aria-current and active classes', () => {
    const active = pageButtons()[0];

    expect(active.getAttribute('aria-current')).toBe('page');
    expect(active.className).toContain('smart:bg-blue-600');
    expect(active.className).toContain('smart:font-semibold');
  });

  it('should disable Previous on the first page', () => {
    const prev = nav().querySelector<HTMLButtonElement>(
      'button[aria-label="Previous"]',
    );

    expect(prev?.disabled).toBe(true);
  });

  it('should emit pageChange when a page button is clicked', () => {
    let emitted: number | undefined;
    component.pageChange.subscribe((page) => (emitted = page));

    pageButtons()[1].click();

    expect(emitted).toBe(2);
  });

  it('should emit the next page when Next is clicked', () => {
    let emitted: number | undefined;
    component.pageChange.subscribe((page) => (emitted = page));

    nav()
      .querySelector<HTMLButtonElement>('button[aria-label="Next"]')
      ?.click();

    expect(emitted).toBe(2);
  });

  it('should render the results summary only for the card-footer variant', () => {
    fixture.componentRef.setInput('variant', 'card-footer');
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('totalItems', 25);
    fixture.detectChanges();

    const summary = fixture.nativeElement.querySelector('p');

    expect(summary?.textContent).toContain('Showing 1 to 10 of 25');
  });

  it('should NOT render the results summary for the simple variant', () => {
    fixture.componentRef.setInput('variant', 'simple');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p')).toBeNull();
  });

  it('should center the nav for the centered variant', () => {
    fixture.componentRef.setInput('variant', 'centered');
    fixture.detectChanges();

    expect(nav().className).toContain('smart:justify-center');
  });

  it('should render an ellipsis when there are many pages', () => {
    fixture.componentRef.setInput('totalPages', 20);
    fixture.componentRef.setInput('currentPage', 10);
    fixture.detectChanges();

    const ellipsis = Array.from(nav().querySelectorAll('span')).filter(
      (el) => el.textContent?.trim() === '...',
    );

    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it('should apply cssClass on the container (forwarded via the class alias)', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('div');

    expect(container.className).toContain('my-extra-class');
  });
});
