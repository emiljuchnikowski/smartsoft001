// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  AvatarBaseComponent,
  AvatarComponent,
  AVATAR_STANDARD_COMPONENT_TOKEN,
  IAvatarItem,
  SmartAvatarSize,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-avatar',
  template: `
    <span [class]="containerClasses()">
      @if (isGroup()) {
        @for (item of group(); track item.id) {
          <span class="docs-avatar__group-item">
            @if (item.imageUrl; as url) {
              <img [src]="url" alt="" />
            } @else {
              <span class="docs-avatar__initials">{{ item.initials }}</span>
            }
          </span>
        }
      } @else if (imageUrl(); as url) {
        <img [src]="url" alt="" />
      } @else if (initials(); as text) {
        <span class="docs-avatar__initials">{{ text }}</span>
      } @else {
        <span class="docs-avatar__placeholder" aria-hidden="true"
          >&middot;</span
        >
      }

      @if (notificationPosition(); as position) {
        <span
          class="docs-avatar__notification"
          [attr.data-position]="position"
        ></span>
      }
    </span>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomAvatarComponent extends AvatarBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() =>
    [
      'docs-avatar',
      `docs-avatar--${this.size()}`,
      `docs-avatar--${this.shape()}`,
      this.cssClass(),
    ]
      .filter(Boolean)
      .join(' '),
  );
}

@Component({
  selector: 'docs-avatar-custom-example',
  imports: [AvatarComponent],
  providers: [
    {
      provide: AVATAR_STANDARD_COMPONENT_TOKEN,
      useValue: CustomAvatarComponent,
    },
  ],
  template: `
    <smart-avatar
      [initials]="initials"
      [size]="size()"
      shape="rounded"
      notificationPosition="top"
    />

    <smart-avatar [group]="team" size="sm" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarCustomExampleComponent {
  initials = 'TW';
  size = signal<SmartAvatarSize>('md');

  team: IAvatarItem[] = [
    { id: 'ana', initials: 'AK' },
    { id: 'bo', initials: 'BS' },
    { id: 'cai', initials: 'CL' },
  ];
}
// #endregion
