import { ArrayService } from '@smartsoft001/utils';

import { IIconButtonOptions } from '../../models';
import { SmartStore } from '../../store';

export type AppEndButton = IIconButtonOptions & { id?: string };

/**
 * The buttons pages add to the end of the app toolbar, and the document title
 * built from the current route. The Angular service subscribed to the router;
 * here the navigation adapter calls `updateTitle` with each new URL.
 */
export class AppService {
  readonly endButtons = new SmartStore<AppEndButton[]>([]);
  readonly title = new SmartStore<string>('');

  private baseTitle: string | undefined;

  constructor(
    private readonly translate: (key: string) => string = (key) => key,
  ) {}

  addEndButton(button: AppEndButton): void {
    if (button.id) {
      const exist = this.endButtons.get().find((e) => e.id === button.id);

      if (exist) {
        this.endButtons.set(
          this.endButtons
            .get()
            .map((e) => (e.id === button.id ? { ...e, ...button } : e)),
        );
        return;
      }
    }

    this.endButtons.set(ArrayService.addItem(this.endButtons.get(), button));
  }

  removeEndButton(buttonOrId: AppEndButton | string): void {
    if (typeof buttonOrId === 'object') {
      const button = buttonOrId.id
        ? this.endButtons.get().find((e) => e.id === buttonOrId.id)
        : buttonOrId;

      this.endButtons.set(this.endButtons.get().filter((e) => e !== button));
      return;
    }

    this.endButtons.set(
      this.endButtons.get().filter((e) => e.id !== buttonOrId),
    );
  }

  /** Remembers the document's title as the prefix of every route title. */
  initTitle(): void {
    if (typeof document !== 'undefined') this.baseTitle = document.title;
  }

  /**
   * Sets the document title to the base title followed by each segment of
   * `url`, translated through `ROUTES.<segment>` when a translation exists.
   */
  updateTitle(url: string): void {
    let title =
      (this.baseTitle ?? '') +
      '|' +
      url
        .split('/')
        .filter((x) => x && x.trim())
        .map((x) => {
          x = x.split('?')[0];
          const key = 'ROUTES.' + x;
          const translated = this.translate(key);
          return key === translated ? x : translated;
        })
        .join('|');

    title = title
      .split('|')
      .filter((x) => x && x.trim())
      .join('|');

    if (typeof document !== 'undefined') document.title = title;

    this.title.set(title);
  }
}
