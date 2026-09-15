import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: DrawerCustomExampleComponent', () => {
  let fixture: ComponentFixture<DrawerCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrawerCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom drawer through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector('smart-drawer docs-custom-drawer'),
    ).toBeTruthy();
    expect(element.querySelector('smart-drawer-standard')).toBeNull();
  });

  it('should render the forwarded title in the custom header', () => {
    const heading = element.querySelector('.docs-drawer__header h2');

    expect(heading?.textContent).toContain('Shopping cart');
  });

  it('should render the overlay because the options ask for it', () => {
    expect(element.querySelector('.docs-drawer__overlay')).toBeTruthy();
  });

  // close() sets the custom component's own `open` model. NgComponentOutlet
  // does not forward outputs, so the wrapper's (closed) never fires.
  it('should hide the panel when the custom close button is clicked', () => {
    const close = element.querySelector<HTMLButtonElement>(
      '.docs-drawer__close',
    );

    close?.click();
    fixture.detectChanges();

    expect(element.querySelector('.docs-drawer__panel')).toBeNull();
  });
});
