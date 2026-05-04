import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMenuStandardComponent } from './standard.component';
import { ISelectMenuOptions } from '../../../models';
import { SelectMenuValue } from '../base/base.component';

describe('@smartsoft001/shared-angular: SelectMenuStandardComponent', () => {
  describe('default rendering (no options)', () => {
    let fixture: ComponentFixture<SelectMenuStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SelectMenuStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectMenuStandardComponent);
      fixture.detectChanges();
    });

    it('should always render the wrapper', () => {
      const wrapper = fixture.nativeElement.querySelector('.select-menu');

      expect(wrapper).toBeTruthy();
    });

    it('should render <select> element', () => {
      const select = fixture.nativeElement.querySelector('select');

      expect(select).toBeTruthy();
    });

    it('should not render any <option> when no items/placeholder', () => {
      const opts = fixture.nativeElement.querySelectorAll('option');

      expect(opts.length).toBe(0);
    });

    it('should apply external cssClass on the wrapper', () => {
      fixture.componentRef.setInput('class', 'my-extra-class');
      fixture.detectChanges();

      const wrapper = fixture.nativeElement.firstElementChild as HTMLElement;

      expect(wrapper.className).toContain('my-extra-class');
    });
  });

  describe('with placeholder and items', () => {
    let fixture: ComponentFixture<SelectMenuStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SelectMenuStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectMenuStandardComponent);
      fixture.detectChanges();
    });

    it('should render placeholder as first <option>', () => {
      fixture.componentRef.setInput('options', {
        placeholder: 'Pick one',
        items: [{ value: 'a', label: 'A' }],
      });
      fixture.detectChanges();

      const opts = fixture.nativeElement.querySelectorAll('option');

      expect(opts.length).toBe(2);
      expect(opts[0].textContent).toContain('Pick one');
      expect(opts[0].hasAttribute('disabled')).toBe(true);
    });

    it('should render one <option> per item', () => {
      fixture.componentRef.setInput('options', {
        items: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
          { value: 'c', label: 'C' },
        ],
      });
      fixture.detectChanges();

      const opts = fixture.nativeElement.querySelectorAll('option');

      expect(opts.length).toBe(3);
      expect(opts[0].textContent.trim()).toBe('A');
      expect(opts[1].getAttribute('value')).toBe('b');
    });

    it('should mark <option> as disabled when item.disabled is true', () => {
      fixture.componentRef.setInput('options', {
        items: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
        ],
      });
      fixture.detectChanges();

      const opts = fixture.nativeElement.querySelectorAll('option');

      expect((opts[1] as HTMLOptionElement).disabled).toBe(true);
    });

    it('should select <option> matching the current value', () => {
      fixture.componentRef.setInput('options', {
        items: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ],
      });
      fixture.componentRef.setInput('value', 'b');
      fixture.detectChanges();

      const select: HTMLSelectElement =
        fixture.nativeElement.querySelector('select');

      expect(select.value).toBe('b');
    });

    it('should disable the <select> when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const select: HTMLSelectElement =
        fixture.nativeElement.querySelector('select');

      expect(select.disabled).toBe(true);
    });

    it('should set aria-label on <select> when options.ariaLabel provided', () => {
      fixture.componentRef.setInput('options', {
        ariaLabel: 'Choose a location',
        items: [{ value: 'a', label: 'A' }],
      });
      fixture.detectChanges();

      const select = fixture.nativeElement.querySelector('select');

      expect(select.getAttribute('aria-label')).toBe('Choose a location');
    });

    it('should update value via change event with matching item value', () => {
      const spy = jest.fn<void, [SelectMenuValue]>();
      fixture.componentRef.setInput('options', {
        items: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ],
      });
      fixture.componentInstance.value.subscribe(spy);
      fixture.detectChanges();

      const select: HTMLSelectElement =
        fixture.nativeElement.querySelector('select');
      select.value = 'b';
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(fixture.componentInstance.value()).toBe('b');
      expect(spy).toHaveBeenCalledWith('b');
    });

    it('should preserve numeric value type when matching item.value is numeric', () => {
      fixture.componentRef.setInput('options', {
        items: [
          { value: 1, label: 'One' },
          { value: 2, label: 'Two' },
        ],
      });
      fixture.detectChanges();

      const select: HTMLSelectElement =
        fixture.nativeElement.querySelector('select');
      select.value = '2';
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(fixture.componentInstance.value()).toBe(2);
    });
  });

  describe('with empty items + emptyTpl', () => {
    @Component({
      selector: 'smart-test-host',
      template: `
        <ng-template #emptyTpl>
          <p class="empty-msg">Brak opcji</p>
        </ng-template>
        <smart-select-menu-standard [options]="options" />
      `,
      imports: [SelectMenuStandardComponent],
    })
    class TestHostComponent {
      @ViewChild('emptyTpl', { static: true }) emptyTpl!: TemplateRef<unknown>;
      options: ISelectMenuOptions = {};
    }

    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render emptyTpl when items is empty and emptyTpl provided', async () => {
      host.options = { items: [], emptyTpl: host.emptyTpl };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const empty = fixture.nativeElement.querySelector('.empty p.empty-msg');

      expect(empty).toBeTruthy();
    });
  });
});
