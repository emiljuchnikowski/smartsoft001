import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandPaletteStandardComponent } from './standard.component';

describe('@smartsoft001/shared-angular: CommandPaletteStandardComponent', () => {
  let fixture: ComponentFixture<CommandPaletteStandardComponent>;
  let component: CommandPaletteStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandPaletteStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommandPaletteStandardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
  });

  it('should render a <dialog> element', () => {
    const dialog = fixture.nativeElement.querySelector('dialog');

    expect(dialog).toBeTruthy();
  });

  it('should reflect open() in the dialog open attribute', () => {
    const dialog = fixture.nativeElement.querySelector('dialog');

    expect(dialog.hasAttribute('open')).toBe(true);
  });

  it('should render an <input type="search"> element', () => {
    const input = fixture.nativeElement.querySelector('input[type="search"]');

    expect(input).toBeTruthy();
  });

  it('should render a <ul role="listbox"> element', () => {
    const list = fixture.nativeElement.querySelector('ul[role="listbox"]');

    expect(list).toBeTruthy();
  });

  it('should render a <li role="option"> per filtered command', () => {
    fixture.componentRef.setInput('commands', [
      { id: 'a', label: 'Alpha' },
      { id: 'b', label: 'Bravo' },
    ]);
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('li[role="option"]');

    expect(options).toHaveLength(2);
  });

  it('should filter rendered options by query (case-insensitive substring)', () => {
    fixture.componentRef.setInput('commands', [
      { id: 'a', label: 'Alpha' },
      { id: 'b', label: 'Bravo' },
      { id: 'c', label: 'Charlie' },
    ]);
    fixture.componentRef.setInput('query', 'BR');
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('li[role="option"]');

    expect(options).toHaveLength(1);
    expect(options[0].textContent.trim()).toBe('Bravo');
  });

  it('should update query() when the input event fires', () => {
    const input = fixture.nativeElement.querySelector('input[type="search"]');
    input.value = 'hello';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.query()).toBe('hello');
  });

  it('should emit runCommand and set open=false when an option is clicked', () => {
    fixture.componentRef.setInput('commands', [{ id: 'alpha', label: 'A' }]);
    fixture.detectChanges();

    const spy = jest.fn();
    component.runCommand.subscribe(spy);

    const option = fixture.nativeElement.querySelector('li[role="option"]');
    option.click();

    expect(spy).toHaveBeenCalledWith({ commandId: 'alpha' });
    expect(component.open()).toBe(false);
  });

  it('should set placeholder on the input from options.placeholder', () => {
    fixture.componentRef.setInput('options', { placeholder: 'Search…' });
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="search"]');

    expect(input.getAttribute('placeholder')).toBe('Search…');
  });

  it('should set aria-label on the input from options.ariaLabel', () => {
    fixture.componentRef.setInput('options', { ariaLabel: 'Commands' });
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="search"]');

    expect(input.getAttribute('aria-label')).toBe('Commands');
  });

  it('should include external cssClass on the dialog when provided', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('dialog');

    expect(dialog.className).toContain('my-extra-class');
  });

  it('should render an empty placeholder when no commands match', () => {
    fixture.componentRef.setInput('commands', [{ id: 'a', label: 'Alpha' }]);
    fixture.componentRef.setInput('query', 'zzz');
    fixture.componentRef.setInput('options', { emptyText: 'Nothing found' });
    fixture.detectChanges();

    const empty = fixture.nativeElement.querySelector(
      '.smart-command-palette-empty',
    );

    expect(empty).toBeTruthy();
    expect(empty.textContent.trim()).toBe('Nothing found');
  });
});
