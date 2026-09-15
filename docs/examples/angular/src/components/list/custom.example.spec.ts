import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import {
  AlertService,
  AuthService,
  HardwareService,
} from '@smartsoft001/angular';

import { ListCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: ListCustomExampleComponent', () => {
  let fixture: ComponentFixture<ListCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCustomExampleComponent, TranslateModule.forRoot()],
      // An application gets these from SharedServicesModule; the example only
      // has to register the custom list mode.
      providers: [
        { provide: HardwareService, useValue: { isMobile: false } },
        { provide: AuthService, useValue: { expectPermissions: () => true } },
        { provide: AlertService, useValue: { show: () => Promise.resolve() } },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom list for the desktop mode instead of the built-in one', () => {
    expect(element.querySelector('smart-list docs-custom-list')).toBeTruthy();
    expect(element.querySelector('smart-list-desktop')).toBeNull();
  });

  it('should render one row per item supplied by the provider', () => {
    const rows = element.querySelectorAll('.docs-list__row');

    expect(rows).toHaveLength(3);
  });

  it('should render one cell per field the model marks as list', () => {
    const cells = element.querySelectorAll(
      '.docs-list__row:first-child .docs-list__cell',
    );

    expect(cells).toHaveLength(3);
    expect(cells[0].textContent).toContain('Jan');
    expect(cells[1].textContent).toContain('jan@example.com');
  });

  it('should render a header per key resolved from the model metadata', () => {
    const headers = element.querySelectorAll('.docs-list__header');

    expect(headers).toHaveLength(3);
    expect(headers[2].textContent).toContain('role');
  });
});
