// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';

import {
  ButtonComponent,
  DescriptionListComponent,
  IButtonOptions,
  IDescriptionListOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-description-list-usage-example',
  imports: [DescriptionListComponent, ButtonComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionListUsageExampleComponent {
  private readonly editEmailTpl =
    viewChild.required<TemplateRef<unknown>>('editEmail');

  readonly options = computed<IDescriptionListOptions>(() => ({
    title: 'Applicant information',
    description: 'Personal details and application.',
    items: [
      { label: 'Full name', value: 'Margot Foster' },
      { label: 'Application for', value: 'Backend Developer' },
      {
        label: 'Email address',
        value: 'margotfoster@example.com',
        actionTpl: this.editEmailTpl(),
      },
      { label: 'Salary expectation', value: '$120,000' },
    ],
  }));

  readonly editedField = signal<string | null>(null);

  readonly updateEmail: IButtonOptions = {
    variant: 'secondary',
    size: 'sm',
    click: () => this.editedField.set('email'),
  };
}
// #endregion
