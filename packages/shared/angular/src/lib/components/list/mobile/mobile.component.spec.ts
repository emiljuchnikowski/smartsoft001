import { Component, Pipe, PipeTransform, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, Model } from '@smartsoft001/models';

import { ListMobileComponent } from './mobile.component';
import { IListInternalOptions, IListProvider } from '../../../models';
import { FileUrlPipe, ListCellPipe } from '../../../pipes';
import { AlertService, AuthService } from '../../../services';
import { PagingComponent } from '../../paging';

@Pipe({ name: 'smartListCell' })
class MockListCellPipe implements PipeTransform {
  transform(): { value: string; type: string } {
    return { value: 'cell-value', type: 'text' };
  }
}

@Pipe({ name: 'smartFileUrl' })
class MockFileUrlPipe implements PipeTransform {
  transform(v: unknown): unknown {
    return v;
  }
}

@Model({})
class TestItemModel implements IEntity<string> {
  id = 'test-id';

  @Field({ list: true })
  firstName = 'Jane';
}

function createProvider(
  data: TestItemModel[] = [],
): IListProvider<TestItemModel> {
  return {
    list: signal<TestItemModel[]>(data),
    loading: signal(false),
    getData: jest.fn(),
  } as unknown as IListProvider<TestItemModel>;
}

@Component({
  selector: 'smart-paging',
  template: '',
})
class MockPagingComponent {
  currentPage: number | undefined;
  totalPages: number | undefined;
}

@Component({
  selector: 'smart-test-host',
  template: `<smart-list-mobile
    [options]="options"
    [class]="cssClass"
  ></smart-list-mobile>`,
  imports: [ListMobileComponent],
})
class TestHostComponent {
  items: TestItemModel[] = [];
  options: IListInternalOptions<TestItemModel> = {
    provider: createProvider(this.items),
    type: TestItemModel,
    fields: [{ key: 'firstName', options: { list: true } }],
  };
  cssClass = '';
}

describe('@smartsoft001/shared-angular: ListMobileComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let mobile: ListMobileComponent<TestItemModel>;

  async function setup(items: TestItemModel[] = []) {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { expectPermissions: () => true } },
        { provide: AlertService, useValue: { show: jest.fn() } },
        {
          provide: TranslateService,
          useValue: {
            instant: (k: string) => k,
            get: () => ({
              subscribe: () => ({ unsubscribe: () => undefined }),
            }),
          },
        },
      ],
    })
      .overrideComponent(ListMobileComponent, {
        remove: {
          imports: [PagingComponent, ListCellPipe, FileUrlPipe],
        },
        add: {
          imports: [MockPagingComponent, MockListCellPipe, MockFileUrlPipe],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.options = {
      provider: createProvider(items),
      type: TestItemModel,
      fields: [{ key: 'firstName', options: { list: true } }],
    };
    fixture.detectChanges();
    mobile = fixture.debugElement.children[0].componentInstance;
  }

  it('should render a <ul role="list"> with Tailwind divide classes', async () => {
    await setup();

    const ul = fixture.nativeElement.querySelector('ul[role="list"]');

    expect(ul).toBeTruthy();
    expect(ul.className).toContain('smart:divide-y');
    expect(ul.className).toContain('dark:smart:divide-white/10');
  });

  it('should include base container classes in containerClasses()', async () => {
    await setup();

    const classes = mobile.containerClasses();

    expect(classes).toContain('smart:divide-y');
    expect(classes).toContain('smart:divide-gray-100');
    expect(classes).toContain('dark:smart:divide-white/10');
  });

  it('should append cssClass to containerClasses when provided', async () => {
    await setup();
    fixture.componentInstance.cssClass = 'my-extra-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mobile.containerClasses()).toContain('my-extra-class');
  });

  it('should render one <li> per item in mobileList()', async () => {
    const items: TestItemModel[] = [
      Object.assign(new TestItemModel(), { id: 'a' }),
      Object.assign(new TestItemModel(), { id: 'b' }),
      Object.assign(new TestItemModel(), { id: 'c' }),
    ];
    await setup(items);

    const rows = fixture.nativeElement.querySelectorAll('ul[role="list"] > li');

    expect(rows.length).toBe(3);
  });
});
