import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { HardwareService } from '@smartsoft001/angular';

import { PageUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: PageUsageExampleComponent', () => {
  let fixture: ComponentFixture<PageUsageExampleComponent>;
  let element: HTMLElement;
  let back: jest.Mock;

  beforeEach(async () => {
    back = jest.fn();

    await TestBed.configureTestingModule({
      // An application registers these once, at the root: the router and
      // translations in app.config.ts, HardwareService via SharedServicesModule.
      imports: [PageUsageExampleComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        HardwareService,
        { provide: Location, useValue: { back } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageUsageExampleComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should render the title from the options', () => {
    expect(element.querySelector('h2')?.textContent).toContain('Team members');
  });

  it('should render the projected body', () => {
    expect(element.textContent).toContain('12 people have access');
  });

  it('should pass typed search text to the search handler', () => {
    const search = element.querySelector('input') as HTMLInputElement;

    search.value = 'alice';
    search.dispatchEvent(new Event('input'));

    expect(fixture.componentInstance.searchText()).toBe('alice');
  });

  it('should navigate back when the back button is clicked', () => {
    element.querySelector<HTMLButtonElement>('button')?.click();

    expect(back).toHaveBeenCalledTimes(1);
  });
});
