import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  COMMAND_PALETTE_EMPTY,
  COMMAND_PALETTE_FOOTER,
  COMMAND_PALETTE_GROUP,
  COMMAND_PALETTE_ITEM_ICON,
  COMMAND_PALETTE_ITEM_IMAGE,
  COMMAND_PALETTE_ITEM_LABEL,
  COMMAND_PALETTE_PREVIEW,
  COMMAND_PALETTE_PREVIEW_LAYOUT,
  COMMAND_PALETTE_SEARCH,
  COMMAND_PALETTE_SEARCH_ICON,
  COMMAND_PALETTE_SEARCH_WRAP,
  getCommandPaletteDialogClasses,
  getCommandPaletteItemClasses,
  getCommandPaletteListClasses,
} from './preset-classes.util';
import { ICommand, SmartCommandPaletteVariant } from '../../../models';
import { CommandPaletteStandardComponent } from '../standard/standard.component';

interface ICommandGroup {
  group: string;
  commands: ICommand[];
}

/**
 * Styled command-palette variation (preset).
 *
 * Drop-in replacement for `CommandPaletteStandardComponent` — register it via
 * `COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN` to restyle every
 * `<smart-command-palette>`, or use the `<smart-command-palette-preset>`
 * selector directly. All filtering/selection logic is inherited from the base;
 * this component only adds the visual variants driven by `options.variant`.
 */
@Component({
  selector: 'smart-command-palette-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class CommandPalettePresetComponent extends CommandPaletteStandardComponent {
  // NgComponentOutlet (used by CommandPaletteComponent when this preset is
  // registered through the token) passes inputs by canonical name, so the
  // inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  private readonly previewOverride = signal<ICommand | null>(null);

  protected readonly variant = computed<SmartCommandPaletteVariant>(
    () => this.options()?.variant ?? 'simple',
  );

  protected readonly emptyText = computed(
    () => this.options()?.emptyText ?? 'No results',
  );

  protected readonly groupedCommands = computed<ICommandGroup[]>(() => {
    const groups: ICommandGroup[] = [];
    for (const command of this.filteredCommands()) {
      const key = command.group ?? 'Other';
      const existing = groups.find((g) => g.group === key);
      if (existing) {
        existing.commands.push(command);
      } else {
        groups.push({ group: key, commands: [command] });
      }
    }
    return groups;
  });

  // Defaults to the first result; hovering a row overrides it.
  protected readonly previewCommand = computed<ICommand | null>(
    () => this.previewOverride() ?? this.filteredCommands()[0] ?? null,
  );

  protected readonly dialogClasses = computed(() =>
    [getCommandPaletteDialogClasses(this.variant()), this.cssClass()]
      .filter(Boolean)
      .join(' '),
  );

  protected readonly listClasses = computed(() =>
    getCommandPaletteListClasses(this.variant()),
  );

  protected readonly itemClasses = computed(() =>
    getCommandPaletteItemClasses(this.variant()),
  );

  protected readonly searchWrapClasses = COMMAND_PALETTE_SEARCH_WRAP;
  protected readonly searchIconClasses = COMMAND_PALETTE_SEARCH_ICON;
  protected readonly searchClasses = COMMAND_PALETTE_SEARCH;
  protected readonly itemIconClasses = COMMAND_PALETTE_ITEM_ICON;
  protected readonly itemImageClasses = COMMAND_PALETTE_ITEM_IMAGE;
  protected readonly itemLabelClasses = COMMAND_PALETTE_ITEM_LABEL;
  protected readonly groupClasses = COMMAND_PALETTE_GROUP;
  protected readonly emptyClasses = COMMAND_PALETTE_EMPTY;
  protected readonly footerClasses = COMMAND_PALETTE_FOOTER;
  protected readonly previewLayoutClasses = COMMAND_PALETTE_PREVIEW_LAYOUT;
  protected readonly previewClasses = COMMAND_PALETTE_PREVIEW;

  protected setPreview(command: ICommand): void {
    this.previewOverride.set(command);
  }
}
