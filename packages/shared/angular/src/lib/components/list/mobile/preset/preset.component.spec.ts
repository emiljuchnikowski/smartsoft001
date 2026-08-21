import { Component, Pipe, PipeTransform, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { ListMobilePresetComponent } from './preset.component';
import { IListInternalOptions, IListProvider } from '../../../../models';
import { FileUrlPipe, ListCellPipe } from '../../../../pipes';
import { AlertService, AuthService } from '../../../../services';
import { PagingComponent } from '../../../paging';

@Pipe({ name: 'smartListCell' })
class MockListCellPipe implements PipeTransform {
  transform(_obj: unknown, key: string): { value: string; type: string } {
    if (key === 'photo') return { value: 'file-id', type: FieldType.image };
    return { value: `value-${key}`, type: 'text' };
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

  @Field({ list: true, type: FieldType.image })
  photo = 'file-id';

  @Field({ list: true })
  firstName = 'Jane';

  @Field({ list: true })
  lastName = 'Doe';
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

const FIELDS = [
  { key: 'photo', options: { list: true, type: FieldType.image } },
  { key: 'firstName', options: { list: true } },
  { key: 'lastName', options: { list: true } },
];

@Component({
  selector: 'smart-test-host',
  template: `<smart-list-mobile-preset
    [options]="options"
  ></smart-list-mobile-preset>`,
  imports: [ListMobilePresetComponent],
})
class TestHostComponent {
  options: IListInternalOptions<TestItemModel> = {
    provider: createProvider([]),
    type: TestItemModel,
    fields: FIELDS,
  } as unknown as IListInternalOptions<TestItemModel>;
}

describe('@smartsoft001/shared-angular: ListMobilePresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let preset: ListMobilePresetComponent<TestItemModel>;

  async function setup(
    items: TestItemModel[] = [],
    options: Partial<IListInternalOptions<TestItemModel>> = {},
  ) {
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
            onTranslationChange: {
              subscribe: () => ({ unsubscribe: () => undefined }),
            },
            onLangChange: {
              subscribe: () => ({ unsubscribe: () => undefined }),
            },
            onDefaultLangChange: {
              subscribe: () => ({ unsubscribe: () => undefined }),
            },
            onFallbackLangChange: {
              subscribe: () => ({ unsubscribe: () => undefined }),
            },
          },
        },
      ],
    })
      .overrideComponent(ListMobilePresetComponent, {
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
      fields: FIELDS,
      ...options,
    } as unknown as IListInternalOptions<TestItemModel>;
    fixture.detectChanges();
    preset = fixture.debugElement.children[0].componentInstance;
  }

  function makeItems(count: number): TestItemModel[] {
    return Array.from({ length: count }, (_, i) =>
      Object.assign(new TestItemModel(), { id: `id-${i}` }),
    );
  }

  function markPresetDirty(): void {
    (preset as unknown as { cd: { markForCheck(): void } }).cd.markForCheck();
  }

  it('should render a grid <ul> with grid + gap classes', async () => {
    await setup(makeItems(1));

    const ul = (fixture.nativeElement as HTMLElement).querySelector(
      'ul[role="list"]',
    );

    expect(ul).toBeTruthy();
    expect(ul?.className).toContain('smart:grid');
    expect(ul?.className).toContain('smart:gap-4');
  });

  it('should render one card per item', async () => {
    await setup(makeItems(3));

    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-role="card"]',
    );

    expect(cards.length).toBe(3);
  });

  it('should apply preset card container classes to each card', async () => {
    await setup(makeItems(1));

    const card = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="card"]',
    );

    expect(card?.className).toContain('smart:rounded-xl');
    expect(card?.className).toContain('smart:border');
    expect(card?.className).toContain('smart:bg-white');
  });

  it('should render an image with rounded-t-xl for FieldType.image cells', async () => {
    await setup(makeItems(1));

    const img = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="card-image"]',
    );

    expect(img).toBeTruthy();
    expect(img?.className).toContain('smart:rounded-t-xl');
  });

  it('should map the first non-image cell to the card title', async () => {
    await setup(makeItems(1));

    const titles = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-role="card-title"]',
    );

    expect(titles.length).toBe(1);
    expect(titles[0].innerHTML).toContain('value-firstName');
  });

  it('should map remaining non-image cells to card text', async () => {
    await setup(makeItems(1));

    const texts = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-role="card-text"]',
    );

    expect(texts.length).toBe(1);
    expect(texts[0].innerHTML).toContain('value-lastName');
  });

  it('should render an item button and call itemHandler on click', async () => {
    await setup(makeItems(1));
    const spy = jest.fn();
    preset.itemHandler = spy;
    markPresetDirty();
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="item"]',
    ) as HTMLButtonElement;
    button.click();

    expect(spy).toHaveBeenCalledWith('id-0');
  });

  it('should render a remove button and call removeHandler on click', async () => {
    await setup(makeItems(1));
    const spy = jest.fn();
    preset.removeHandler = spy;
    preset.checkRemoveHandler = () => true;
    markPresetDirty();
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="remove"]',
    ) as HTMLButtonElement;
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should not render a remove button when checkRemoveHandler returns false', async () => {
    await setup(makeItems(1));
    preset.removeHandler = jest.fn();
    preset.checkRemoveHandler = () => false;
    markPresetDirty();
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="remove"]',
    );

    expect(button).toBeFalsy();
  });
});
