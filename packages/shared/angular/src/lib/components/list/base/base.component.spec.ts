import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, Model } from '@smartsoft001/models';

import { ListBaseComponent } from './base.component';
import { IListInternalOptions, IListProvider } from '../../../models';
import { AlertService, AuthService } from '../../../services';

@Model({})
class TestItemModel implements IEntity<string> {
  id = 'test-id';

  @Field({ list: true })
  firstName = 'Jane';
}

@Component({
  selector: 'smart-test-list',
  template: '',
})
class TestListComponent extends ListBaseComponent<TestItemModel> {}

function createProvider(): IListProvider<TestItemModel> {
  return {
    list: signal<TestItemModel[]>([]),
    loading: signal(false),
    getData: jest.fn(),
  } as unknown as IListProvider<TestItemModel>;
}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-list [options]="options" [class]="cssClass" />`,
  imports: [TestListComponent],
})
class TestHostComponent {
  options: IListInternalOptions<TestItemModel> = {
    provider: createProvider(),
    type: TestItemModel,
    fields: [{ key: 'firstName', options: { list: true } }],
  };
  cssClass = '';
}

describe('@smartsoft001/shared-angular: ListBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let list: TestListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { expectPermissions: () => true } },
        { provide: AlertService, useValue: { show: jest.fn() } },
        {
          provide: TranslateService,
          useValue: { instant: (k: string) => k },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    list = fixture.debugElement.children[0].componentInstance;
  });

  it('should default cssClass to empty string', () => {
    expect(list.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    fixture.componentInstance.cssClass = 'my-custom-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(list.cssClass()).toBe('my-custom-class');
  });

  it('should populate keys from fields marked as list', () => {
    expect(list.keys).toEqual(['firstName']);
  });

  it('should set removeHandler when options.remove.provider.invoke is provided', async () => {
    fixture.componentInstance.options = {
      provider: createProvider(),
      type: TestItemModel,
      fields: [{ key: 'firstName', options: { list: true } }],
      remove: { provider: { invoke: jest.fn() } },
    } as IListInternalOptions<TestItemModel>;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(list.removeHandler).not.toBeNull();
  });
});
