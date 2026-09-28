import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeadingUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: PageHeadingUsageExampleComponent', () => {
  let fixture: ComponentFixture<PageHeadingUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeadingUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeadingUsageExampleComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should render the title and subtitle from the options', () => {
    expect(element.querySelector('h1')?.textContent).toContain(
      'Back End Developer',
    );
    expect(element.querySelector('.subtitle')?.textContent).toContain(
      'Full-time, remote',
    );
  });

  it('should run the handler of an action rendered through actionsTpl', () => {
    const publish = Array.from(
      element.querySelectorAll<HTMLButtonElement>('.actions button'),
    ).find((button) => button.textContent?.includes('Publish'));

    publish?.click();

    expect(fixture.componentInstance.lastAction()).toBe('publish');
  });
});
