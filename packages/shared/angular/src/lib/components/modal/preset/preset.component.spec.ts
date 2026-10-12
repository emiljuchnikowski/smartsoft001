import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPresetComponent } from './preset.component';

describe('@smartsoft001/shared-angular: ModalPresetComponent', () => {
  let fixture: ComponentFixture<ModalPresetComponent>;
  let component: ModalPresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalPresetComponent);
    component = fixture.componentInstance;
  });

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function dialog(): HTMLElement | null {
    return host().querySelector('[role="dialog"]');
  }

  function open(): void {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(ModalPresetComponent);
  });

  it('should not render anything when closed', () => {
    fixture.detectChanges();

    expect(dialog()).toBeNull();
  });

  it('should render a dialog with modal ARIA when open', () => {
    open();

    const el = dialog();

    expect(el).toBeTruthy();
    expect(el?.getAttribute('aria-modal')).toBe('true');
  });

  it('should render the title and link it via aria-labelledby', () => {
    fixture.componentRef.setInput('title', 'Modal title');
    open();

    expect(dialog()?.getAttribute('aria-labelledby')).toBe(
      'smart-modal-preset-title',
    );
    expect(
      host().querySelector('#smart-modal-preset-title')?.textContent,
    ).toContain('Modal title');
  });

  it('should fall back to options.ariaLabel when there is no title', () => {
    fixture.componentRef.setInput('options', { ariaLabel: 'Settings dialog' });
    open();

    expect(dialog()?.getAttribute('aria-label')).toBe('Settings dialog');
  });

  it('should render the description', () => {
    fixture.componentRef.setInput('description', 'Some content');
    open();

    expect(host().querySelector('p')?.textContent).toContain('Some content');
  });

  it('should default to the centered variant width', () => {
    open();

    const wrapper = dialog()?.parentElement;

    expect(wrapper?.className).toContain('smart:sm:max-w-lg');
    expect(wrapper?.className).toContain('smart:items-center');
  });

  it('should apply wide variant width classes', () => {
    fixture.componentRef.setInput('options', { variant: 'wide' });
    open();

    const wrapper = dialog()?.parentElement;

    expect(wrapper?.className).toContain('smart:lg:max-w-4xl');
  });

  it('should not render the dismiss button by default', () => {
    fixture.componentRef.setInput('title', 'Modal title');
    open();

    expect(host().querySelector('button[aria-label="Close"]')).toBeNull();
  });

  it('should render the dismiss button when options.withDismiss is true', () => {
    fixture.componentRef.setInput('options', { withDismiss: true });
    open();

    expect(host().querySelector('button[aria-label="Close"]')).toBeTruthy();
  });

  it('should close and emit closed when the dismiss button is clicked', () => {
    fixture.componentRef.setInput('options', { withDismiss: true });
    open();

    let closed = false;
    component.closed.subscribe(() => (closed = true));

    host()
      .querySelector<HTMLButtonElement>('button[aria-label="Close"]')
      ?.click();
    fixture.detectChanges();

    expect(closed).toBe(true);
    expect(component.open()).toBe(false);
  });

  it('should render actions and emit actionClick with the action id', () => {
    fixture.componentRef.setInput('actions', [
      { id: 'save', label: 'Save changes', variant: 'primary' },
      { id: 'cancel', label: 'Cancel', variant: 'secondary' },
    ]);
    open();

    let emittedId: string | undefined;
    component.actionClick.subscribe((e) => (emittedId = e.actionId));

    const buttons = (host() as HTMLElement).querySelectorAll(
      '[role="dialog"] button',
    );
    (buttons[0] as HTMLButtonElement).click();

    expect(buttons.length).toBe(2);
    expect(emittedId).toBe('save');
  });

  it('should apply danger action classes for danger actions', () => {
    fixture.componentRef.setInput('actions', [
      { id: 'delete', label: 'Delete', variant: 'danger' },
    ]);
    open();

    const button = host().querySelector('[role="dialog"] button');

    expect(button?.className).toContain('smart:bg-red-600');
  });

  it('should left-align the footer for the left-aligned-buttons variant', () => {
    fixture.componentRef.setInput('options', {
      variant: 'left-aligned-buttons',
    });
    fixture.componentRef.setInput('actions', [{ id: 'ok', label: 'OK' }]);
    open();

    const footer = host().querySelector(
      '[role="dialog"] button',
    )?.parentElement;

    expect(footer?.className).toContain('smart:justify-start');
  });

  it('should apply gray footer style classes', () => {
    fixture.componentRef.setInput('options', { footerStyle: 'gray' });
    fixture.componentRef.setInput('actions', [{ id: 'ok', label: 'OK' }]);
    open();

    const footer = host().querySelector(
      '[role="dialog"] button',
    )?.parentElement;

    expect(footer?.className).toContain('smart:bg-gray-50');
  });

  describe('bottom-sheet variant', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('options', {
        variant: 'bottom-sheet',
        footerStyle: 'gray',
      });
      fixture.componentRef.setInput('actions', [{ id: 'ok', label: 'OK' }]);
      open();
    });

    it('should dock the wrapper to the bottom of the viewport at full width', () => {
      const wrapper = dialog()?.parentElement;

      expect(wrapper?.className).toContain('smart:fixed');
      expect(wrapper?.className).toContain('smart:bottom-0');
      expect(wrapper?.className).toContain('smart:w-full');
      expect(wrapper?.className).toContain('smart:sm:max-w-2xl');
      expect(wrapper?.className).not.toContain('smart:m-3');
      expect(wrapper?.className).not.toContain('smart:items-center');
    });

    it('should cap the height of the panel and round its top corners from sm', () => {
      const panel = dialog();

      expect(panel?.className).toContain('smart:max-h-[85dvh]');
      expect(panel?.className).toContain('smart:sm:rounded-t-xl');
      expect(panel?.className).not.toContain('smart:rounded-xl');
    });

    it('should scroll the body inside the panel', () => {
      const body = host().querySelector('[role="dialog"] > .smart\\:p-4');

      expect(body?.className).toContain('smart:overflow-y-auto');
    });

    it('should not round the bottom of the gray footer', () => {
      const footer = host().querySelector(
        '[role="dialog"] button',
      )?.parentElement;

      expect(footer?.className).toContain('smart:bg-gray-50');
      expect(footer?.className).not.toContain('smart:rounded-b-xl');
    });

    it('should close on a click on the backdrop', () => {
      host()
        .querySelector<HTMLElement>('[role="presentation"]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      fixture.detectChanges();

      expect(component.open()).toBe(false);
    });

    it('should close on Escape', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();

      expect(component.open()).toBe(false);
    });
  });

  it('should close when the backdrop is clicked', () => {
    open();

    let closed = false;
    component.closed.subscribe(() => (closed = true));

    const backdrop = host().querySelector('[role="presentation"]');
    (backdrop as HTMLElement).dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    );
    fixture.detectChanges();

    expect(closed).toBe(true);
    expect(component.open()).toBe(false);
  });

  it('should apply cssClass on the wrapper (declared without the class alias)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    open();

    expect(dialog()?.parentElement?.className).toContain('my-extra-class');
  });

  it('should close only the modal on top when modals are stacked', () => {
    // Arrange
    open();
    const top = TestBed.createComponent(ModalPresetComponent);
    top.componentRef.setInput('open', true);
    top.detectChanges();

    // Act
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    top.detectChanges();

    // Assert
    expect(top.componentInstance.open()).toBe(false);
    expect(component.open()).toBe(true);
    expect(dialog()).not.toBeNull();
  });

  it('should close the next modal on the next Escape', () => {
    // Arrange
    open();
    const top = TestBed.createComponent(ModalPresetComponent);
    top.componentRef.setInput('open', true);
    top.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    top.detectChanges();
    fixture.detectChanges();

    // Act
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    // Assert
    expect(component.open()).toBe(false);
    expect(dialog()).toBeNull();
  });
});
