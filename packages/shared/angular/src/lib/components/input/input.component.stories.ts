import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  signal,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { IAddress } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { SharedFactoriesModule } from '../../factories';
import { InputOptions } from '../../models';
import { IModelLabelProvider } from '../../providers';
import { FileService } from '../../services';
import {
  FORM_COMPONENT_TOKEN,
  INPUT_FIELD_COMPONENTS_TOKEN,
} from '../../shared.inectors';
import { COMPONENTS, IMPORTS } from '../components.module';
import { InputArrayComponent } from './array/array.component';
import { InputAttachmentComponent } from './attachment/attachment.component';
import { InputBaseComponent } from './base/base.component';
import { InputErrorComponent } from './error/error.component';
import { InputFileComponent } from './file/file.component';
import { InputImageComponent } from './image/image.component';
import { InputComponent } from './input.component';
import { InputPdfComponent } from './pdf/pdf.component';

class MockModelLabelProvider extends IModelLabelProvider {
  private labels: Record<string, string> = {
    name: 'Nazwa',
    email: 'Email',
    password: 'Hasło',
    nip: 'NIP',
    pesel: 'PESEL',
    age: 'Wiek',
    price: 'Cena',
    amount: 'Kwota',
    phone: 'Telefon',
    phonePl: 'Telefon PL',
    description: 'Opis',
    startDate: 'Data rozpoczęcia',
    dateEdit: 'Data (ręczna edycja)',
    range: 'Zakres dat',
    active: 'Aktywny',
    status: 'Status',
    tags: 'Tagi',
    categories: 'Kategorie',
    color: 'Kolor',
    logo: 'Logo',
    address: 'Adres',
    labels: 'Etykiety',
    ids: 'Identyfikatory',
    file: 'File upload',
    image: 'Profile photo',
    document: 'Document (PDF)',
    attachment: 'Attachment',
    items: 'Items',
  };

  override get(input: { instance: any; key: string; type?: any }) {
    return signal(this.labels[input.key] ?? input.key);
  }
}

const meta: Meta<InputComponent<any>> = {
  title: 'Smart-Input/Input',
  component: InputComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ...IMPORTS,
        ReactiveFormsModule,
        SharedFactoriesModule,
        TranslateModule.forRoot(),
      ],
      declarations: [...COMPONENTS],
      providers: [
        { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
        {
          provide: FileService,
          useValue: {
            getUrl: (id: string) => `https://picsum.photos/seed/${id}/150/150`,
            download: (id: string) => console.log('[storybook] download', id),
            upload: () => undefined,
            delete: () => Promise.resolve(),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }),
  ],
};

export default meta;
type Story = StoryObj<InputComponent<any>>;

function buildOptions<T>(
  model: T,
  fieldKey: string,
  control: UntypedFormControl,
): InputOptions<T> {
  new UntypedFormGroup({ [fieldKey]: control });
  return {
    control,
    fieldKey,
    model,
    treeLevel: 0,
  };
}

function storyWrapper(props: Record<string, unknown>, extraTemplate = '') {
  return {
    props,
    template: `
      <div class="smart:p-4 smart:max-w-lg">
        <smart-input [options]="options"></smart-input>
        ${extraTemplate}
      </div>
    `,
  };
}

// ─── 1. Text ────────────────────────────────────────────────────────────────

export const Text: Story = {
  name: 'Text',
  render: () => {
    @Model({})
    class TextModel {
      @Field({ type: FieldType.text }) name = '';
    }
    const control = new UntypedFormControl('Przykładowy tekst');
    return storyWrapper({
      options: buildOptions(new TextModel(), 'name', control),
    });
  },
};

// ─── 2. Email ───────────────────────────────────────────────────────────────

export const Email: Story = {
  name: 'Email',
  render: () => {
    @Model({})
    class EmailModel {
      @Field({ type: FieldType.email }) email = '';
    }
    const control = new UntypedFormControl('user@example.com');
    return storyWrapper({
      options: buildOptions(new EmailModel(), 'email', control),
    });
  },
};

// ─── 3. Password ────────────────────────────────────────────────────────────

export const Password: Story = {
  name: 'Password',
  render: () => {
    @Model({})
    class PasswordModel {
      @Field({ type: FieldType.password, required: true }) password = '';
    }
    const control = new UntypedFormControl('', Validators.required);
    return storyWrapper({
      options: buildOptions(new PasswordModel(), 'password', control),
    });
  },
};

// ─── 4. NIP ─────────────────────────────────────────────────────────────────

export const Nip: Story = {
  name: 'NIP',
  render: () => {
    @Model({})
    class NipModel {
      @Field({ type: FieldType.nip }) nip = '';
    }
    const control = new UntypedFormControl('1234567890');
    return storyWrapper({
      options: buildOptions(new NipModel(), 'nip', control),
    });
  },
};

// ─── 5. PESEL ───────────────────────────────────────────────────────────────

export const Pesel: Story = {
  name: 'PESEL',
  render: () => {
    @Model({})
    class PeselModel {
      @Field({ type: FieldType.pesel }) pesel = '';
    }
    const control = new UntypedFormControl('');
    return storyWrapper({
      options: buildOptions(new PeselModel(), 'pesel', control),
    });
  },
};

// ─── 6. Int ─────────────────────────────────────────────────────────────────

export const Int: Story = {
  name: 'Int',
  render: () => {
    @Model({})
    class IntModel {
      @Field({ type: FieldType.int }) age = 0;
    }
    const control = new UntypedFormControl(25);
    return storyWrapper({
      options: buildOptions(new IntModel(), 'age', control),
    });
  },
};

// ─── 7. Float ───────────────────────────────────────────────────────────────

export const Float: Story = {
  name: 'Float',
  render: () => {
    @Model({})
    class FloatModel {
      @Field({ type: FieldType.float }) price = 0;
    }
    const control = new UntypedFormControl(19.99);
    return storyWrapper({
      options: buildOptions(new FloatModel(), 'price', control),
    });
  },
};

// ─── 8. Currency ────────────────────────────────────────────────────────────

export const Currency: Story = {
  name: 'Currency',
  render: () => {
    @Model({})
    class CurrencyModel {
      @Field({ type: FieldType.currency }) amount = 0;
    }
    const control = new UntypedFormControl(100.5);
    return storyWrapper({
      options: buildOptions(new CurrencyModel(), 'amount', control),
    });
  },
};

// ─── 9. Phone Number ────────────────────────────────────────────────────────

export const PhoneNumber: Story = {
  name: 'Phone Number',
  render: () => {
    @Model({})
    class PhoneModel {
      @Field({ type: FieldType.phoneNumber }) phone = '';
    }
    const control = new UntypedFormControl('+48123456789');
    return storyWrapper({
      options: buildOptions(new PhoneModel(), 'phone', control),
    });
  },
};

// ─── 10. Phone Number PL ────────────────────────────────────────────────────

export const PhoneNumberPl: Story = {
  name: 'Phone Number PL',
  render: () => {
    @Model({})
    class PhonePlModel {
      @Field({ type: FieldType.phoneNumberPl }) phonePl = '';
    }
    const control = new UntypedFormControl('600700800');
    return storyWrapper({
      options: buildOptions(new PhonePlModel(), 'phonePl', control),
    });
  },
};

// ─── 11. Long Text ──────────────────────────────────────────────────────────

export const LongText: Story = {
  name: 'Long Text',
  render: () => {
    @Model({})
    class LongTextModel {
      @Field({ type: FieldType.longText }) description = '';
    }
    const control = new UntypedFormControl(
      '<p>Przykładowy <b>tekst</b> sformatowany.</p>',
    );
    return storyWrapper({
      options: buildOptions(new LongTextModel(), 'description', control),
    });
  },
};

// ─── 12. Date ───────────────────────────────────────────────────────────────

export const Date: Story = {
  name: 'Date',
  render: () => {
    @Model({})
    class DateModel {
      @Field({ type: FieldType.date }) startDate = '';
    }
    const control = new UntypedFormControl('2026-04-20');
    return storyWrapper({
      options: buildOptions(new DateModel(), 'startDate', control),
    });
  },
};

// ─── 13. Date With Edit ─────────────────────────────────────────────────────

export const DateWithEdit: Story = {
  name: 'Date With Edit',
  render: () => {
    @Model({})
    class DateEditModel {
      @Field({ type: FieldType.dateWithEdit }) dateEdit = '';
    }
    const control = new UntypedFormControl('2026-04-20');
    return storyWrapper({
      options: buildOptions(new DateEditModel(), 'dateEdit', control),
    });
  },
};

// ─── 14. Date Range ─────────────────────────────────────────────────────────

export const DateRange: Story = {
  name: 'Date Range',
  render: () => {
    @Model({})
    class DateRangeModel {
      @Field({ type: FieldType.dateRange }) range: any = null;
    }
    const control = new UntypedFormControl({
      start: '2026-04-01',
      end: '2026-04-30',
    });
    return storyWrapper({
      options: buildOptions(new DateRangeModel(), 'range', control),
    });
  },
};

// ─── 15. Flag ───────────────────────────────────────────────────────────────

export const Flag: Story = {
  name: 'Flag (checkbox)',
  render: () => {
    @Model({})
    class FlagModel {
      @Field({ type: FieldType.flag }) active = true;
    }
    const control = new UntypedFormControl(true);
    return storyWrapper({
      options: buildOptions(new FlagModel(), 'active', control),
    });
  },
};

// ─── 16. Radio ──────────────────────────────────────────────────────────────

export const Radio: Story = {
  name: 'Radio',
  render: () => {
    @Model({})
    class RadioModel {
      @Field({
        type: FieldType.radio,
        possibilities: { Aktywny: 1, Nieaktywny: 2, Oczekujący: 3 },
      })
      status = 1;
    }
    const control = new UntypedFormControl(1);
    return storyWrapper({
      options: {
        ...buildOptions(new RadioModel(), 'status', control),
        possibilities: signal([
          { id: 1, text: 'Aktywny', checked: true },
          { id: 2, text: 'Nieaktywny', checked: false },
          { id: 3, text: 'Oczekujący', checked: false },
        ]),
      },
    });
  },
};

// ─── 17. Check ──────────────────────────────────────────────────────────────

export const Check: Story = {
  name: 'Check (multi)',
  render: () => {
    @Model({})
    class CheckModel {
      @Field({ type: FieldType.check })
      tags: string[] = [];
    }
    const control = new UntypedFormControl([]);
    return storyWrapper({
      options: {
        ...buildOptions(new CheckModel(), 'tags', control),
        possibilities: signal([
          { id: 'alpha', text: 'Alpha', checked: false },
          { id: 'beta', text: 'Beta', checked: false },
          { id: 'gamma', text: 'Gamma', checked: false },
        ]),
      },
    });
  },
};

// ─── 18. Enum ───────────────────────────────────────────────────────────────

export const Enum: Story = {
  name: 'Enum',
  render: () => {
    enum CategoryEnum {
      News = 'News',
      Tutorial = 'Tutorial',
      Guide = 'Guide',
    }
    @Model({})
    class EnumModel {
      @Field({ type: FieldType.enum, possibilities: CategoryEnum })
      categories: CategoryEnum[] = [];
    }
    const control = new UntypedFormControl([CategoryEnum.News]);
    return storyWrapper({
      options: buildOptions(new EnumModel(), 'categories', control),
    });
  },
};

// ─── 19. Color ──────────────────────────────────────────────────────────────

export const Color: Story = {
  name: 'Color',
  render: () => {
    @Model({})
    class ColorModel {
      @Field({ type: FieldType.color }) color = '#4f46e5';
    }
    const control = new UntypedFormControl('#4f46e5');
    return storyWrapper({
      options: buildOptions(new ColorModel(), 'color', control),
    });
  },
};

// ─── 20. Logo ───────────────────────────────────────────────────────────────

export const Logo: Story = {
  name: 'Logo',
  render: () => {
    @Model({})
    class LogoModel {
      @Field({ type: FieldType.logo }) logo = '';
    }
    const control = new UntypedFormControl('');
    return storyWrapper({
      options: buildOptions(new LogoModel(), 'logo', control),
    });
  },
};

// ─── 21. Address ────────────────────────────────────────────────────────────

export const Address: Story = {
  name: 'Address',
  render: () => {
    @Model({})
    class AddressModel {
      @Field({ type: FieldType.address }) address!: IAddress;
    }
    const control = new UntypedFormGroup({
      city: new UntypedFormControl('Warszawa'),
      zipCode: new UntypedFormControl('00-001'),
      street: new UntypedFormControl('Marszałkowska'),
      buildingNumber: new UntypedFormControl('10'),
      flatNumber: new UntypedFormControl('5'),
    });
    return storyWrapper({
      options: {
        control: control as any,
        fieldKey: 'address',
        model: new AddressModel(),
        treeLevel: 0,
      },
    });
  },
};

// ─── 22. Ints ───────────────────────────────────────────────────────────────

export const Ints: Story = {
  name: 'Ints (dynamic list)',
  render: () => {
    @Model({})
    class IntsModel {
      @Field({ type: FieldType.ints }) ids: number[] = [];
    }
    const control = new UntypedFormControl([1, 2, 3]);
    return storyWrapper({
      options: buildOptions(new IntsModel(), 'ids', control),
    });
  },
};

// ─── 23. Strings ────────────────────────────────────────────────────────────

export const Strings: Story = {
  name: 'Strings (dynamic list)',
  render: () => {
    @Model({})
    class StringsModel {
      @Field({ type: FieldType.strings }) labels: string[] = [];
    }
    const control = new UntypedFormControl(['alpha', 'beta']);
    return storyWrapper({
      options: buildOptions(new StringsModel(), 'labels', control),
    });
  },
};

// ─── 24. With CSS Class ─────────────────────────────────────────────────────

export const WithCssClass: Story = {
  name: 'With CSS Class',
  render: () => {
    @Model({})
    class TextModel {
      @Field({ type: FieldType.text }) name = '';
    }
    const control = new UntypedFormControl('Pole z dodatkową klasą');
    return storyWrapper({
      options: buildOptions(new TextModel(), 'name', control),
    });
  },
};

// ─── 25. With Error ─────────────────────────────────────────────────────────

export const WithError: Story = {
  name: 'With Error',
  render: () => {
    @Model({})
    class TextModel {
      @Field({ type: FieldType.text, required: true }) name = '';
    }
    const control = new UntypedFormControl('', Validators.required);
    control.markAsTouched();
    return storyWrapper({
      options: buildOptions(new TextModel(), 'name', control),
    });
  },
};

// ─── 26. Custom via Token ───────────────────────────────────────────────────

@Component({
  selector: 'custom-input-text',
  template: `
    <div
      class="smart:rounded smart:border-2 smart:border-indigo-500 smart:bg-indigo-50 smart:p-3 smart:dark:bg-indigo-900/30"
    >
      <strong class="smart:text-indigo-700 smart:dark:text-indigo-300"
        >Custom Text Input:</strong
      >
      <span class="smart:ml-2 smart:text-gray-900 smart:dark:text-white">{{
        control?.value
      }}</span>
    </div>
  `,
  standalone: true,
})
class CustomInputTextComponent extends InputBaseComponent<any> {
  override cssClass = input<string>('');
}

export const CustomViaToken: Story = {
  name: 'Custom via Token',
  render: () => {
    @Model({})
    class TextModel {
      @Field({ type: FieldType.text }) name = '';
    }
    const control = new UntypedFormControl('Zastąpione przez custom komponent');
    return {
      props: {
        options: buildOptions(new TextModel(), 'name', control),
      },
      template: `
        <div class="smart:p-4 smart:max-w-lg">
          <smart-input [options]="options"></smart-input>
        </div>
      `,
      moduleMetadata: {
        providers: [
          {
            provide: INPUT_FIELD_COMPONENTS_TOKEN,
            useValue: { [FieldType.text]: CustomInputTextComponent },
          },
        ],
      },
    };
  },
};

// ─── 27. Playground ─────────────────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground (mixed grid)',
  render: () => {
    @Model({})
    class MixedModel {
      @Field({ type: FieldType.text }) name = '';
      @Field({ type: FieldType.email }) email = '';
      @Field({ type: FieldType.int }) age = 0;
      @Field({ type: FieldType.flag }) active = false;
      @Field({ type: FieldType.color }) color = '';
      @Field({ type: FieldType.date }) startDate = '';
    }
    const model = new MixedModel();
    const rows = [
      {
        fieldKey: 'name',
        control: new UntypedFormControl('Jan Kowalski'),
      },
      {
        fieldKey: 'email',
        control: new UntypedFormControl('jan@example.com'),
      },
      { fieldKey: 'age', control: new UntypedFormControl(30) },
      { fieldKey: 'active', control: new UntypedFormControl(true) },
      { fieldKey: 'color', control: new UntypedFormControl('#10b981') },
      {
        fieldKey: 'startDate',
        control: new UntypedFormControl('2026-04-20'),
      },
    ].map((r) => ({
      ...r,
      options: buildOptions(model, r.fieldKey, r.control),
    }));
    return {
      props: { rows },
      template: `
        <div class="smart:grid smart:grid-cols-1 md:smart:grid-cols-2 smart:gap-6 smart:p-4">
          @for (row of rows; track row.fieldKey) {
            <smart-input [options]="row.options"></smart-input>
          }
        </div>
      `,
    };
  },
};

// ─── 28. File ───────────────────────────────────────────────────────────────

export const File: Story = {
  name: 'File',
  render: () => {
    @Model({})
    class FileModel {
      @Field({ type: FieldType.file, possibilities: '.pdf,.docx' } as any)
      file: any = null;
    }
    const control = new UntypedFormControl(null);
    new UntypedFormGroup({ file: control });
    return {
      props: {
        options: {
          control,
          fieldKey: 'file',
          model: new FileModel(),
          treeLevel: 0,
        } as InputOptions<FileModel>,
      },
      template: `
        <div class="smart:p-4 smart:max-w-lg">
          <smart-input [options]="options"></smart-input>
        </div>
      `,
      moduleMetadata: {
        imports: [InputFileComponent],
      },
    };
  },
};

// ─── 29. Image ──────────────────────────────────────────────────────────────

export const Image: Story = {
  name: 'Image',
  render: () => {
    @Model({})
    class ImageModel {
      @Field({ type: FieldType.image }) image: any = null;
    }
    const control = new UntypedFormControl({ id: 'demo' });
    new UntypedFormGroup({ image: control });
    return {
      props: {
        options: {
          control,
          fieldKey: 'image',
          model: new ImageModel(),
          treeLevel: 0,
        } as InputOptions<ImageModel>,
      },
      template: `
        <div class="smart:p-4 smart:max-w-lg">
          <smart-input [options]="options"></smart-input>
        </div>
      `,
      moduleMetadata: {
        imports: [InputImageComponent],
      },
    };
  },
};

// ─── 30. Pdf ────────────────────────────────────────────────────────────────

export const Pdf: Story = {
  name: 'Pdf',
  render: () => {
    @Model({})
    class PdfModel {
      @Field({ type: FieldType.pdf }) document: any = null;
    }
    const control = new UntypedFormControl({
      id: 'demo',
      fileName: 'contract.pdf',
    });
    new UntypedFormGroup({ document: control });
    return {
      props: {
        options: {
          control,
          fieldKey: 'document',
          model: new PdfModel(),
          treeLevel: 0,
        } as InputOptions<PdfModel>,
      },
      template: `
        <div class="smart:p-4 smart:max-w-lg">
          <smart-input [options]="options"></smart-input>
        </div>
      `,
      moduleMetadata: {
        imports: [InputPdfComponent],
      },
    };
  },
};

// ─── 31. Attachment ─────────────────────────────────────────────────────────

export const Attachment: Story = {
  name: 'Attachment',
  render: () => {
    @Model({})
    class AttachmentModel {
      @Field({
        type: FieldType.attachment,
        possibilities: '.pdf,.doc,.zip',
      } as any)
      attachment: any = null;
    }
    const control = new UntypedFormControl({
      id: 'demo',
      fileName: 'archive.zip',
    });
    new UntypedFormGroup({ attachment: control });
    return {
      props: {
        options: {
          control,
          fieldKey: 'attachment',
          model: new AttachmentModel(),
          treeLevel: 0,
        } as InputOptions<AttachmentModel>,
      },
      template: `
        <div class="smart:p-4 smart:max-w-lg">
          <smart-input [options]="options"></smart-input>
        </div>
      `,
      moduleMetadata: {
        imports: [InputAttachmentComponent],
      },
    };
  },
};

// ─── 32. Array ──────────────────────────────────────────────────────────────

// Minimal stub form component used only to satisfy FORM_COMPONENT_TOKEN
@Component({
  selector: 'story-stub-form',
  template: `<div class="smart:text-sm smart:text-gray-500">[stub form]</div>`,
  standalone: true,
})
class StubFormComponent {}

export const Array: Story = {
  name: 'Array',
  render: () => {
    @Model({})
    class ItemModel {
      @Field({ type: FieldType.text }) name = '';
    }

    @Model({})
    class ArrayModel {
      @Field({ type: FieldType.array, classType: ItemModel } as any)
      items: ItemModel[] = [];
    }

    const control = new UntypedFormArray([]);
    new UntypedFormGroup({ items: control });
    return {
      props: {
        options: {
          control,
          fieldKey: 'items',
          model: new ArrayModel(),
          treeLevel: 0,
        } as InputOptions<ArrayModel>,
      },
      template: `
        <div class="smart:p-4 smart:max-w-lg">
          <smart-input [options]="options"></smart-input>
        </div>
      `,
      moduleMetadata: {
        imports: [InputArrayComponent, StubFormComponent],
        providers: [
          { provide: FORM_COMPONENT_TOKEN, useValue: StubFormComponent },
        ],
      },
    };
  },
};

// ─── 33. InputError (standalone component showcase) ─────────────────────────

export const InputError: Story = {
  name: 'Input Error (component showcase)',
  render: () => {
    return {
      props: {},
      template: `
        <div class="smart:space-y-2 smart:p-4">
          <p class="smart:text-sm smart:font-medium smart:text-gray-700 smart:dark:text-gray-300 smart:mb-4">
            All error states rendered by <code>smart-input-error</code>:
          </p>
          <smart-input-error [errors]="{ required: true }"></smart-input-error>
          <smart-input-error [errors]="{ email: true }"></smart-input-error>
          <smart-input-error [errors]="{ minlength: { requiredLength: 5 } }"></smart-input-error>
          <smart-input-error [errors]="{ maxlength: { requiredLength: 20 } }"></smart-input-error>
          <smart-input-error [errors]="{ min: { min: 0 } }"></smart-input-error>
          <smart-input-error [errors]="{ max: { max: 100 } }"></smart-input-error>
          <smart-input-error [errors]="{ customMessage: 'Własny komunikat błędu' }"></smart-input-error>
        </div>
      `,
      moduleMetadata: {
        imports: [InputErrorComponent],
      },
    };
  },
};
