import { Component, Pipe, PipeTransform, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, Model } from '@smartsoft001/models';

import { ListDesktopPresetComponent } from './preset.component';
import { IListInternalOptions, IListProvider } from '../../../../models';
import { FileUrlPipe, ListCellPipe, ListHeaderPipe } from '../../../../pipes';
import { AlertService, AuthService } from '../../../../services';
import { PagingComponent } from '../../../paging';

@Pipe({ name: 'smartListHeader' })
class MockListHeaderPipe implements PipeTransform {
  transform(): () => string {
    return () => 'Name';
  }
}

@Pipe({ name: 'smartListCell' })
class MockListCellPipe implements PipeTransform {
  transform(): null {
    return null;
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
  items: TestItemModel[] = [],
): IListProvider<TestItemModel> {
  return {
    list: signal<TestItemModel[]>(items),
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
  template: `<smart-list-desktop-preset
    [options]="options"
  ></smart-list-desktop-preset>`,
  imports: [ListDesktopPresetComponent],
})
class TestHostComponent {
  options: IListInternalOptions<TestItemModel> = {
    provider: createProvider([new TestItemModel()]),
    type: TestItemModel,
    fields: [{ key: 'firstName', options: { list: true } }],
  };
}

async function createFixture(
  options: Partial<IListInternalOptions<TestItemModel>>,
): Promise<{
  fixture: ComponentFixture<TestHostComponent>;
  preset: ListDesktopPresetComponent<TestItemModel>;
}> {
  const fixture = TestBed.createComponent(TestHostComponent);
  fixture.componentInstance.options = {
    ...fixture.componentInstance.options,
    ...options,
  } as IListInternalOptions<TestItemModel>;
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();

  const preset = fixture.debugElement.children[0]
    .componentInstance as ListDesktopPresetComponent<TestItemModel>;

  return { fixture, preset };
}

describe('@smartsoft001/shared-angular: ListDesktopPresetComponent', () => {
  beforeEach(async () => {
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
            get: (k: string) => ({
              subscribe: (fn: (v: string) => void) => {
                fn(k);
                return { unsubscribe: () => undefined };
              },
            }),
            onLangChange: {
              subscribe: () => ({ unsubscribe: () => undefined }),
            },
            onTranslationChange: {
              subscribe: () => ({ unsubscribe: () => undefined }),
            },
            onDefaultLangChange: {
              subscribe: () => ({ unsubscribe: () => undefined }),
            },
          },
        },
      ],
    })
      .overrideComponent(ListDesktopPresetComponent, {
        remove: {
          imports: [PagingComponent, ListHeaderPipe, ListCellPipe, FileUrlPipe],
        },
        add: {
          imports: [
            MockPagingComponent,
            MockListHeaderPipe,
            MockListCellPipe,
            MockFileUrlPipe,
          ],
        },
      })
      .compileComponents();
  });

  it('should render a body row from the provider list', async () => {
    const { fixture } = await createFixture({});

    const rows = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-role="row"]',
    );

    expect(rows.length).toBe(1);
  });

  it('should apply default Preline table classes', async () => {
    const { fixture } = await createFixture({});

    const table = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="table"]',
    );

    expect(table).toBeTruthy();
    expect(table?.className).toContain('smart:min-w-full');
    expect(table?.className).toContain('smart:divide-y');
    expect(table?.className).toContain('smart:dark:divide-gray-700');
  });

  it('should drop table dividers for the borderless variant', async () => {
    const { preset } = await createFixture({
      presentation: { variant: 'borderless' },
    });

    expect(preset.tableClasses()).toContain('smart:min-w-full');
    expect(preset.tableClasses()).not.toContain('smart:divide-y');
  });

  it('should apply striped classes on body rows', async () => {
    const { preset } = await createFixture({
      presentation: { variant: 'striped' },
    });

    expect(preset.rowClasses()).toContain('smart:odd:bg-white');
    expect(preset.rowClasses()).toContain('smart:even:bg-gray-50');
    expect(preset.rowClasses()).toContain('smart:dark:even:bg-gray-800');
  });

  it('should apply hoverable classes on body rows', async () => {
    const { preset } = await createFixture({
      presentation: { hoverable: true },
    });

    expect(preset.rowClasses()).toContain('smart:hover:bg-gray-100');
    expect(preset.rowClasses()).toContain('smart:dark:hover:bg-gray-700');
  });

  it('should add a border on the container for the bordered variant', async () => {
    const { preset } = await createFixture({
      presentation: { variant: 'bordered' },
    });

    expect(preset.containerClasses()).toContain('smart:border');
    expect(preset.containerClasses()).toContain('smart:border-gray-200');
  });

  it('should apply muted header row classes', async () => {
    const { preset } = await createFixture({
      presentation: { header: 'muted' },
    });

    expect(preset.headerRowClasses()).toContain('smart:bg-gray-50');
    expect(preset.headerRowClasses()).toContain('smart:dark:bg-gray-800');
  });

  it('should hide the header row when header is none', async () => {
    const { preset } = await createFixture({
      presentation: { header: 'none' },
    });

    expect(preset.headerRowClasses()).toContain('smart:hidden');
  });

  it('should render a remove button that calls the remove handler', async () => {
    const { fixture, preset } = await createFixture({
      remove: { provider: { invoke: jest.fn() } },
    });
    const removeSpy = jest.fn();
    preset.removeHandler = removeSpy;
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="remove"]',
    ) as HTMLButtonElement | null;

    expect(button).toBeTruthy();
    button?.click();
    expect(removeSpy).toHaveBeenCalledTimes(1);
  });

  it('should render an item button that calls the item handler', async () => {
    const { fixture, preset } = await createFixture({
      item: { options: { select: jest.fn(), edit: false } },
    });
    const itemSpy = jest.fn();
    preset.itemHandler = itemSpy;
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="item"]',
    ) as HTMLButtonElement | null;

    expect(button).toBeTruthy();
    button?.click();
    expect(itemSpy).toHaveBeenCalledWith('test-id');
  });
});
