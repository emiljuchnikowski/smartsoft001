import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagingCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: PagingCustomExampleComponent', () => {
  let fixture: ComponentFixture<PagingCustomExampleComponent>;
  let component: PagingCustomExampleComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagingCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PagingCustomExampleComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom paging through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector('smart-paging docs-custom-paging'),
    ).toBeTruthy();
    expect(element.querySelector('smart-paging-standard')).toBeNull();
  });

  it('should render the range summary computed by the base class', () => {
    const summary = element.querySelector('.docs-paging__summary');

    expect(summary?.textContent).toContain('1');
    expect(summary?.textContent).toContain('10');
    expect(summary?.textContent).toContain('48');
  });

  it('should disable the previous button on the first page', () => {
    const previous = element.querySelector<HTMLButtonElement>(
      '.docs-paging__previous',
    );

    expect(previous?.disabled).toBe(true);
  });

  // smart-paging creates the custom component imperatively and subscribes to
  // its pageChange, so unlike the NgComponentOutlet wrappers it does forward
  // the output back to the caller.
  it('should forward pageChange from the custom component to the wrapper', () => {
    const next = element.querySelector<HTMLButtonElement>('.docs-paging__next');

    next?.click();
    fixture.detectChanges();

    expect(component.currentPage()).toBe(2);
  });
});
