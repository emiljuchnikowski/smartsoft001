import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Title} from "@angular/platform-browser";
import {NavigationEnd, Router} from "@angular/router";

import {ArrayService} from "@smartsoft001/utils";

import {IIconButtonOptions} from "../../../../models/src/lib/interfaces";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private static _endButtonsSource$ = new BehaviorSubject<AppEndButton[]>([]);
    private static _titleSource$ = new BehaviorSubject<string>('');
    private _baseTitle: string;

    endButtons$ = AppService._endButtonsSource$.asObservable();
    title$ = AppService._titleSource$.asObservable();

    constructor(
        private titleService: Title,
        private translate: TranslateService,
        private router: Router
    ) { }

    addEndButton(button: AppEndButton): void {
        if (button.id) {
            const exist = AppService._endButtonsSource$.value.find(e => e.id ===
button.id);

            if (exist) {
                Object.keys(button).filter(k => k !== 'id').forEach(key => {
                    exist[key] = button[key];
                })
                AppService._endButtonsSource$.next([ ...AppService._endButtonsSo
urce$.value ]);
                return;
            }
        }
        AppService._endButtonsSource$.next(ArrayService.addItem(AppService._endB
uttonSource$.value, button));
    }

    removeEndButton(buttonOrId: AppEndButton | string): void {
        if (typeof buttonOrId === 'object') {
            const button = (buttonOrId as AppEndButton).id ?
                AppService._endButtonsSource$.value.find(e => e.id === (buttonOr
Id as AppEndButton).id)
                : (buttonOrId as AppEndButton)

            AppService._endButtonsSource$.next(ArrayService.removeItem(AppServic
e._endButtonsSource$.value, button));
            return;
        }


        AppService._endButtonsSource$.next([
            ...AppService._endButtonsSource$.value.filter(e => e.id !== (buttonO
rId as string))
        ]);
    }

    initTitle() {
        this._baseTitle = this.titleService.getTitle();

        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                const data: NavigationEnd = event;

                let title = this._baseTitle + '|'
                    + data.urlAfterRedirects.split('/')
                        .filter(x => x && x.trim())
                        .map(x => {
                            x = x.split('?')[0];
                            const key = 'ROUTES.' + x;
                            const translate = this.translate.instant(key);
                            return key === translate ? x : translate;
                        })
                        .join('|');

                title = title
                    .split('|')
                    .filter(x => x && x.trim())
                    .join('|');

                this.titleService.setTitle(title);
                AppService._titleSource$.next(title);
            }
        });
    }
}

export type AppEndButton = IIconButtonOptions & { id?: string } ;
