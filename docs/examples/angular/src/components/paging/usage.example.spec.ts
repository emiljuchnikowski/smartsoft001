import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { PagingUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: PagingUsageExampleComponent', () => {
  let fixture: ComponentFixture<PagingUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // The standard paging labels its buttons through the translate pipe; an
      // application provides translations once in app.config.ts.
      imports: [PagingUsageExampleComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PagingUsageExampleComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should mark the current page from the inputs', () => {
    const current = element.querySelector('[aria-current="page"]');

    expect(current?.textContent?.trim()).toBe('1');
  });

  it('should hand the selected page to the handler', () => {
    const page2 = Array.from(
      element.querySelectorAll<HTMLButtonElement>('nav button'),
    ).find((button) => button.textContent?.trim() === '2');

    page2?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.currentPage()).toBe(2);
    expect(
      element.querySelector('[aria-current="page"]')?.textContent?.trim(),
    ).toBe('2');
  });
});
