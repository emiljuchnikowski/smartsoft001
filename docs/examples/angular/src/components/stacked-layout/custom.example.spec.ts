import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedLayoutCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: StackedLayoutCustomExampleComponent', () => {
  let fixture: ComponentFixture<StackedLayoutCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackedLayoutCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StackedLayoutCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom layout through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector('smart-stacked-layout docs-custom-stacked-layout'),
    ).toBeTruthy();
    expect(element.querySelector('smart-stacked-layout-standard')).toBeNull();
  });

  it('should render the navigation template and the title from the options', () => {
    // Act
    const nav = element.querySelector('.docs-stacked-layout__nav');
    const header = element.querySelector('.docs-stacked-layout__header h1');

    // Assert
    expect(nav?.textContent).toContain('Dashboard');
    expect(header?.textContent).toContain('Projects');
  });

  it('should render the content projected into the wrapper in the main area', () => {
    // Act
    const main = element.querySelector('.docs-stacked-layout__main');

    // Assert
    expect(main?.textContent).toContain('Main content of the page.');
  });

  it('should turn the container width into a modifier class', () => {
    const container = element.querySelector('.docs-stacked-layout');

    expect(container?.classList).toContain('docs-stacked-layout--xl');
  });
});
