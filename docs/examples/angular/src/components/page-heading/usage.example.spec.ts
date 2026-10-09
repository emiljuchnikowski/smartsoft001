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
    // Act
    const title = element.querySelector('h1');

    // Assert
    expect(title?.textContent).toContain('Back End Developer');
    expect(element.querySelector('.subtitle')?.textContent).toContain(
      'Full-time, remote',
    );
  });

  it('should render the actions slot in the actions zone', () => {
    // Act
    const buttons = element.querySelectorAll('.actions button');

    // Assert
    expect(
      Array.from(buttons).map((button) => button.textContent?.trim()),
    ).toEqual(['Edit', 'Publish']);
  });

  it('should show the action rendered through actionsTpl', () => {
    // Arrange
    const publish = Array.from(
      element.querySelectorAll<HTMLButtonElement>('.actions button'),
    ).find((button) => button.textContent?.includes('Publish'));

    // Act
    publish?.click();
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Last action: publish');
  });
});
