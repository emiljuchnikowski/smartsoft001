import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { ArrayService } from '@smartsoft001/utils';

import { IIconButtonOptions } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private static _endButtonsSource$ = new BehaviorSubject<AppEndButton[]>([]);
  private static _titleSource$ = new BehaviorSubject<string>('');
  private _baseTitle: string | undefined;

  endButtons$ = AppService._endButtonsSource$.asObservable();
  title$ = AppService._titleSource$.asObservable();

  constructor(
    private titleService: Title,
    private translate: TranslateService,
    private router: Router,
  ) {}

  addEndButton(button: AppEndButton): void {
    if (button.id) {
      const exist = AppService._endButtonsSource$.value.find(
        (e) => e.id === button.id,
      );

      if (exist) {
        Object.keys(button)
          .filter((k) => k !== 'id')
          .forEach((key) => {
            (exist as any)[key] = (button as any)[key];
          });
        AppService._endButtonsSource$.next([
          ...AppService._endButtonsSource$.value,
        ]);
        return;
      }
    }
    AppService._endButtonsSource$.next(
      ArrayService.addItem(AppService._endButtonsSource$.value, button),
    );
  }

  removeEndButton(buttonOrId: AppEndButton | string): void {
    if (typeof buttonOrId === 'object') {
      const button = (buttonOrId as AppEndButton).id
        ? AppService._endButtonsSource$.value.find(
            (e) => e.id === (buttonOrId as AppEndButton).id,
          )
        : (buttonOrId as AppEndButton);

      AppService._endButtonsSource$.next(
        ArrayService.removeItem(
          AppService._endButtonsSource$.value,
          button,
        ) as AppEndButton[],
      );
      return;
    }

    AppService._endButtonsSource$.next([
      ...AppService._endButtonsSource$.value.filter(
        (e) => e.id !== (buttonOrId as string),
      ),
    ]);
  }

  initTitle() {
    this._baseTitle = this.titleService.getTitle();

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const data: NavigationEnd = event;

        let title =
          this._baseTitle +
          '|' +
          data.urlAfterRedirects
            .split('/')
            .filter((x) => x && x.trim())
            .map((x) => {
              x = x.split('?')[0];
              const key = 'ROUTES.' + x;
              const translate = this.translate.instant(key);
              return key === translate ? x : translate;
            })
            .join('|');

        title = title
          .split('|')
          .filter((x) => x && x.trim())
          .join('|');

        this.titleService.setTitle(title);
        AppService._titleSource$.next(title);
      }
    });
  }
}

export type AppEndButton = IIconButtonOptions & { id?: string };
