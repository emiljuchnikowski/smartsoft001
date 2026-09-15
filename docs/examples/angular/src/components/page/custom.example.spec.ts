import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppService, HardwareService } from '@smartsoft001/angular';

import { PageCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: PageCustomExampleComponent', () => {
  let fixture: ComponentFixture<PageCustomExampleComponent>;
  let element: HTMLElement;
  let back: jest.Mock;

  beforeEach(async () => {
    back = jest.fn();

    await TestBed.configureTestingModule({
      imports: [PageCustomExampleComponent],
      // An application gets these from SharedServicesModule and the router;
      // the example only has to register the custom page variant.
      providers: [
        { provide: Location, useValue: { back } },
        {
          provide: HardwareService,
          useValue: { isMobile: false, isMobileWeb: false },
        },
        { provide: AppService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom page variant instead of the standard one', () => {
    expect(element.querySelector('smart-page docs-custom-page')).toBeTruthy();
    expect(element.querySelector('smart-page-standard')).toBeNull();
  });

  it('should render the title from the options', () => {
    expect(element.querySelector('.docs-page__title')?.textContent).toContain(
      'Alice Johnson',
    );
  });

  // smart-page wraps its ng-content in a TemplateRef and hands it over as
  // options.bodyTpl, so projected content does reach a custom variant.
  it('should render the projected body through the bodyTpl slot', () => {
    expect(element.querySelector('.docs-page__body')?.textContent).toContain(
      'Account settings and permissions',
    );
  });

  it('should render the breadcrumbs template slot', () => {
    expect(
      element.querySelector('.docs-page__breadcrumbs')?.textContent,
    ).toContain('Users');
  });

  it('should navigate back through Location when the back button is clicked', () => {
    element.querySelector<HTMLButtonElement>('.docs-page__back')?.click();

    expect(back).toHaveBeenCalledTimes(1);
  });
});
