import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { StyleService } from '@smartsoft001/angular';

import { GroupComponent } from './group.component';
import { ICrudListGroup } from '../../models';
import { CrudListGroupService } from '../../services/list-group/list-group.service';

describe('crud-shell-angular: GroupComponent (characterization)', () => {
  function setup(): ComponentFixture<GroupComponent<any>> {
    const styleMock = { init: jest.fn() };
    const groupServiceMock = {
      change: jest.fn(),
      destroy: jest.fn(),
    };
    const translateMock = {
      currentLang: 'en',
      get: jest.fn((k: string) => ({
        subscribe: (next: (v: string) => void) => {
          next(k);
          return { unsubscribe: jest.fn() };
        },
      })),
      instant: jest.fn((k: string) => k),
      onLangChange: { subscribe: jest.fn() },
      onTranslationChange: { subscribe: jest.fn() },
      onDefaultLangChange: { subscribe: jest.fn() },
    };

    TestBed.configureTestingModule({
      imports: [GroupComponent],
      providers: [
        { provide: StyleService, useValue: styleMock },
        { provide: CrudListGroupService, useValue: groupServiceMock },
        { provide: TranslateService, useValue: translateMock },
      ],
    });

    return TestBed.createComponent(GroupComponent<any>);
  }

  it('should construct the concrete component', () => {
    const fixture = setup();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should expose inherited groups and listOptions inputs', () => {
    const fixture = setup();

    expect(fixture.componentInstance.groups()).toBeNull();
    expect(fixture.componentInstance.listOptions()).toBeNull();
  });

  it('should toggle item.show and delegate to groupService on change', () => {
    jest.useFakeTimers();
    try {
      const fixture = setup();
      const groupService = TestBed.inject(CrudListGroupService) as unknown as {
        change: jest.Mock;
      };
      const item: ICrudListGroup = {
        key: 'a',
        value: '1',
        text: 'A',
      } as ICrudListGroup;

      fixture.componentInstance.change(true, item);
      jest.runAllTimers();

      expect(item.show).toBe(true);
      expect(groupService.change).toHaveBeenCalledWith(true, item, false);
    } finally {
      jest.useRealTimers();
    }
  });

  describe('disclosure template', () => {
    function groups(): Array<ICrudListGroup> {
      return [
        { key: 'a', value: 'a', text: 'A', show: false },
        { key: 'b', value: 'b', text: 'B', show: false },
      ];
    }

    it('should render one disclosure button per group with translated text and aria-expanded false', () => {
      const fixture = setup();

      fixture.componentRef.setInput('groups', groups());
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll(
        'button[aria-expanded]',
      ) as NodeListOf<HTMLButtonElement>;
      expect(buttons.length).toBe(2);
      expect(buttons[0].textContent).toContain('A');
      expect(buttons[1].textContent).toContain('B');
      expect(buttons[0].getAttribute('aria-expanded')).toBe('false');
      expect(buttons[1].getAttribute('aria-expanded')).toBe('false');
    });

    it('should open a group on button click, defer item.show via setTimeout and reveal its region', () => {
      jest.useFakeTimers();
      try {
        const fixture = setup();
        const data = groups();

        fixture.componentRef.setInput('groups', data);
        fixture.detectChanges();
        const groupService = TestBed.inject(
          CrudListGroupService,
        ) as unknown as { change: jest.Mock };

        const button = fixture.nativeElement.querySelector(
          'button[aria-expanded]',
        ) as HTMLButtonElement;
        button.click();

        expect(groupService.change).toHaveBeenCalledWith(true, data[0], false);

        jest.advanceTimersByTime(0);
        fixture.detectChanges();

        expect(data[0].show).toBe(true);
        const refreshedButton = fixture.nativeElement.querySelector(
          'button[aria-expanded]',
        ) as HTMLButtonElement;
        expect(refreshedButton.getAttribute('aria-expanded')).toBe('true');
        expect(
          fixture.nativeElement.querySelector('[id="smart-crud-group-a"]'),
        ).toBeTruthy();
      } finally {
        jest.useRealTimers();
      }
    });

    it('should close sibling groups when opening one', () => {
      jest.useFakeTimers();
      try {
        const fixture = setup();
        const data = groups();
        data[1].show = true;

        fixture.componentRef.setInput('groups', data);
        fixture.detectChanges();

        fixture.componentInstance.change(true, data[0]);
        jest.runAllTimers();

        expect(data[1].show).toBe(false);
        expect(data[0].show).toBe(true);
      } finally {
        jest.useRealTimers();
      }
    });

    it('should close a group immediately without a timer and hide its region', () => {
      jest.useFakeTimers();
      try {
        const fixture = setup();
        const data = groups();
        data[0].show = true;

        fixture.componentRef.setInput('groups', data);
        fixture.detectChanges();

        fixture.componentInstance.change(false, data[0]);

        expect(data[0].show).toBe(false);
        fixture.detectChanges();
        expect(
          fixture.nativeElement.querySelector('[id="smart-crud-group-a"]'),
        ).toBeNull();
      } finally {
        jest.useRealTimers();
      }
    });
  });
});
