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
      get: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
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

    expect(item.show).toBe(true);
    expect(groupService.change).toHaveBeenCalledWith(true, item, false);
  });
});
