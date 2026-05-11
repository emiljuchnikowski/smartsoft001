import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandPaletteBaseComponent } from './base.component';
import { ICommand, ICommandPaletteOptions } from '../../../models';

@Component({
  selector: 'smart-test-command-palette',
  template: '',
})
class TestCommandPaletteComponent extends CommandPaletteBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-command-palette
    [commands]="commands"
    [(open)]="open"
    [(query)]="query"
    [options]="options"
    [class]="cssClass"
  />`,
  imports: [TestCommandPaletteComponent],
})
class TestHostComponent {
  commands: ICommand[] = [];
  open = false;
  query = '';
  options: ICommandPaletteOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: CommandPaletteBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestCommandPaletteComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    directive = fixture.debugElement.children[0].componentInstance;
  });

  it('should create an instance when extended', () => {
    expect(directive).toBeInstanceOf(CommandPaletteBaseComponent);
  });

  it('should have smartType static equal to "command-palette"', () => {
    expect(CommandPaletteBaseComponent.smartType).toBe('command-palette');
  });

  it('should default open to false', () => {
    expect(directive.open()).toBe(false);
  });

  it('should default query to empty string', () => {
    expect(directive.query()).toBe('');
  });

  it('should default commands to empty array', () => {
    expect(directive.commands()).toEqual([]);
  });

  it('should default cssClass to empty string', () => {
    expect(directive.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'my-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('my-class');
  });

  it('should accept ICommandPaletteOptions via options input', async () => {
    host.options = { variant: 'simple', placeholder: 'Search…' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      variant: 'simple',
      placeholder: 'Search…',
    });
  });

  describe('filteredCommands', () => {
    it('should return all commands when query is empty', async () => {
      host.commands = [
        { id: 'a', label: 'Alpha' },
        { id: 'b', label: 'Bravo' },
      ];
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(directive.filteredCommands()).toHaveLength(2);
    });

    it('should filter case-insensitively by label substring', async () => {
      host.commands = [
        { id: 'a', label: 'Alpha' },
        { id: 'b', label: 'Bravo' },
        { id: 'c', label: 'Charlie' },
      ];
      host.query = 'br';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(directive.filteredCommands().map((c) => c.id)).toEqual(['b']);
    });

    it('should return empty array when no command matches query', async () => {
      host.commands = [{ id: 'a', label: 'Alpha' }];
      host.query = 'zzz';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(directive.filteredCommands()).toEqual([]);
    });
  });

  describe('selectCommand()', () => {
    it('should emit runCommand with the given command id', () => {
      const spy = jest.fn();
      directive.runCommand.subscribe(spy);

      directive.selectCommand('alpha');

      expect(spy).toHaveBeenCalledWith({ commandId: 'alpha' });
    });

    it('should set open to false after selecting a command', () => {
      directive.open.set(true);

      directive.selectCommand('alpha');

      expect(directive.open()).toBe(false);
    });
  });

  describe('close()', () => {
    it('should set open to false', () => {
      directive.open.set(true);

      directive.close();

      expect(directive.open()).toBe(false);
    });
  });
});
