import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  BreadcrumbsCustomExampleComponent,
  CustomBreadcrumbsComponent,
} from './custom.example';

describe('docs-examples-angular: BreadcrumbsCustomExampleComponent', () => {
  let fixture: ComponentFixture<BreadcrumbsCustomExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbsCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbsCustomExampleComponent);
    fixture.detectChanges();
  });

  it('should render the custom breadcrumbs instead of the standard ones', () => {
    const nav = fixture.nativeElement.querySelector('nav.docs-breadcrumbs');
    const links = fixture.nativeElement.querySelectorAll(
      '.docs-breadcrumbs__link',
    );

    expect(nav).not.toBeNull();
    expect(links.length).toBe(3);
    expect(links[2].getAttribute('aria-current')).toBe('page');
    expect(
      fixture.nativeElement.querySelector('smart-breadcrumbs-standard'),
    ).toBeNull();
  });

  it('should emit itemClick with the item id when a crumb is clicked', () => {
    const breadcrumbs: CustomBreadcrumbsComponent = fixture.debugElement.query(
      By.directive(CustomBreadcrumbsComponent),
    ).componentInstance;
    const emitted: string[] = [];
    breadcrumbs.itemClick.subscribe((event) => emitted.push(event.itemId));

    const link: HTMLAnchorElement = fixture.nativeElement.querySelector(
      '.docs-breadcrumbs__link',
    );
    link.click();

    expect(emitted).toEqual(['home']);
  });
});
