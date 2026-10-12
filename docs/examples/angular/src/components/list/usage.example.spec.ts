import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { AlertService, HardwareService } from '@smartsoft001/angular';

import { ListUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ListUsageExampleComponent', () => {
  let fixture: ComponentFixture<ListUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListUsageExampleComponent],
      // App-wide services, provided once in the application's root config.
      providers: [provideTranslateService(), AlertService, HardwareService],
    }).compileComponents();

    fixture = TestBed.createComponent(ListUsageExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render a row per record from the provider', () => {
    // Arrange
    const rows = element.querySelectorAll('tbody tr');

    // Act
    const text = element.textContent;

    // Assert
    expect(rows.length).toBe(3);
    expect(text).toContain('Lindsay');
    expect(text).toContain('Walton');
    expect(text).toContain('courtney.henry@example.com');
  });

  it('should show the member of the opened row', () => {
    // Arrange
    const open = element.querySelector<HTMLButtonElement>('tbody td button');

    // Act
    open?.click();
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Selected member: Tom Cook');
  });

  it('should list the members by last name first', () => {
    // Arrange
    const header = element.querySelectorAll('th')[1];

    // Act
    const firstRow = element.querySelector('tbody tr')?.textContent;

    // Assert
    expect(header.getAttribute('aria-sort')).toBe('ascending');
    expect(firstRow).toContain('Cook');
  });

  it('should sort the rows by a clicked column header', () => {
    // Arrange
    const sortByLastName = element.querySelectorAll<HTMLButtonElement>(
      'th [data-role="sort"]',
    )[1];

    // Act
    sortByLastName.click();
    fixture.detectChanges();

    // Assert
    expect(element.querySelectorAll('th')[1].getAttribute('aria-sort')).toBe(
      'descending',
    );
    expect(element.querySelector('tbody tr')?.textContent).toContain('Walton');
  });
});
