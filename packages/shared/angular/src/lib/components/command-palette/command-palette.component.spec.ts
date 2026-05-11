import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandPaletteBaseComponent } from './base/base.component';
import { CommandPaletteComponent } from './command-palette.component';
import { COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-command-palette-injected',
  template: '<div class="injected-command-palette">injected</div>',
})
class MockInjectedComponent extends CommandPaletteBaseComponent {
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: CommandPaletteComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<CommandPaletteComponent>;
    let component: CommandPaletteComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CommandPaletteComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(CommandPaletteComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-command-palette-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-command-palette-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate commands input to standard component', () => {
      fixture.componentRef.setInput('commands', [{ id: 'a', label: 'Alpha' }]);
      fixture.detectChanges();

      expect(component.commands()).toEqual([{ id: 'a', label: 'Alpha' }]);
    });

    it('should propagate open input via model', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      expect(component.open()).toBe(true);
    });

    it('should propagate query input via model', () => {
      fixture.componentRef.setInput('query', 'foo');
      fixture.detectChanges();

      expect(component.query()).toBe('foo');
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input', () => {
      fixture.componentRef.setInput('options', { variant: 'simple' });
      fixture.detectChanges();

      expect(component.options()).toEqual({ variant: 'simple' });
    });
  });

  describe('with COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<CommandPaletteComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CommandPaletteComponent, MockInjectedComponent],
        providers: [
          {
            provide: COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(CommandPaletteComponent);
      fixture.detectChanges();
    });

    it('should render injected component when token is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-command-palette',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-command-palette-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-command-palette-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
