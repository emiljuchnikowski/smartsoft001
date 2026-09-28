import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { AlertService, HardwareService } from '@smartsoft001/angular';

import { ListUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ListUsageExampleComponent', () => {
  let fixture: ComponentFixture<ListUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListUsageExampleComponent],
      // App-wide services, provided once in the application's root config.
      providers: [provideTranslateService(), AlertService, HardwareService],
    }).compileComponents();

    fixture = TestBed.createComponent(ListUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render a row per record from the provider', () => {
    const list: HTMLElement = fixture.nativeElement;

    expect(list.textContent).toContain('Lindsay Walton');
    expect(list.textContent).toContain('courtney.henry@example.com');
    expect(list.querySelectorAll('tbody tr').length).toBe(3);
  });

  it('should hand the id of the opened row to the select handler', () => {
    const open: HTMLButtonElement =
      fixture.nativeElement.querySelector('tbody td button');

    open.click();

    expect(fixture.componentInstance.selectedId()).toBe('1');
  });
});
