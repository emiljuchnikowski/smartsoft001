import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  OnDestroy,
  Directive,
  ElementRef,
  PLATFORM_ID,
  ViewContainerRef,
  AfterContentInit,
  input,
  effect,
  inject,
  viewChild,
  Signal,
  signal,
  computed,
  InputSignal,
  Injector,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { IAppOptions, IMenuItem } from '../../../models';
import { AppService } from '../../../services';
import { AuthService } from '../../../services';
import { MenuService } from '../../../services';
import { StyleService } from '../../../services';

@Directive()
export abstract class AppBaseComponent implements OnDestroy, AfterContentInit {
  protected router = inject(Router);
  protected cd = inject(ChangeDetectorRef);
  protected elementRef = inject(ElementRef);
  protected styleService = inject(StyleService);
  protected menuService = inject(MenuService);
  protected authService = inject(AuthService);
  protected appService = inject(AppService);
  protected readonly platformId = inject(PLATFORM_ID);
  protected document = inject(DOCUMENT);
  private readonly injector = inject(Injector);

  private _subscriptions = new Subscription();

  selectedPath = '';
  showMenu: Signal<boolean> = signal(false).asReadonly();
  menuItems: Signal<IMenuItem[]> = signal([]).asReadonly();
  logged: Signal<boolean> = signal(false).asReadonly();
  username: Signal<string> = signal('').asReadonly();
  loadingPage: Signal<boolean> = signal(false).asReadonly();
  logo: string | undefined;

  routerEvents = toSignal(this.router.events);
  options: InputSignal<IAppOptions> = input.required<IAppOptions>();
  endMenuContainer = viewChild<ViewContainerRef>('endMenuContainer');

  constructor() {
    effect(() => {
      const options = this.options();
      this.initMenu();

      if (options) {
        this.logged = options.provider.logged;
        this.username = options.provider.username;
        this.logo = options.logo;
      }

      this.initLoader();
      this.refreshStyles();
    });

    this.initPermissionClasses();

    this.initSelectedPath();

    if (isPlatformBrowser(this.platformId)) {
      this.styleService.init(this.elementRef);
      this.appService.initTitle();
    }

    effect(async () => {
      const endContainer = this.endMenuContainer();
      if (endContainer) {
        await this.menuService.init(endContainer);
      }
    });
  }

  logout(): void {
    this.options()?.provider.logout();
  }

  async ngAfterContentInit(): Promise<void> {
    this.refreshStyles();
  }

  ngOnDestroy(): void {
    if (this._subscriptions) this._subscriptions.unsubscribe();
  }

  private initMenu(): void {
    this.showMenu = computed(() => {
      const options = this.options();
      const logged = options.provider.logged();
      const disable = this.menuService.disabled();
      if (disable) return false;

      return logged || !!options?.menu?.showForAnonymous;
    });

    const options = this.options();
    if (options?.menu) {
      if (options.menu?.items) {
        this.menuService.setMenuItems(options.menu.items);
      }
      this.menuItems = this.menuService.menuItems;
    }
  }

  private initSelectedPath(): void {
    this._subscriptions.add(
      this.router.events
        .pipe(filter((event) => event && event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          if (event.urlAfterRedirects)
            this.selectedPath = event.urlAfterRedirects;
          else this.selectedPath = event.url;

          this.styleService.init(this.elementRef);

          this.cd.detectChanges();
        }),
    );
  }

  private initLoader() {
    this.loadingPage = computed(() => {
      const routerEvent = this.routerEvents();
      if (routerEvent instanceof NavigationStart) {
        return true;
      } else if (
        routerEvent instanceof NavigationEnd ||
        routerEvent instanceof NavigationCancel ||
        routerEvent instanceof NavigationError
      ) {
        return false;
      }

      return false;
    });
  }

  private refreshStyles(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.styleService.set(this.options()?.style);

        const elementById = this.document.getElementById('app-favicon');
        if (this.logo && elementById) {
          elementById.setAttribute('href', this.logo);
        }
      });
    }
  }

  private initPermissionClasses() {
    if (isPlatformBrowser(this.platformId)) {
      effect(
        () => {
          const logged = this.options().provider.logged();
          if (logged) {
            this.authService.getPermissions().forEach((permission) => {
              (this.elementRef.nativeElement as HTMLElement).classList.add(
                'auth-permissions-' + permission,
              );
            });
          }
        },
        { injector: this.injector },
      ); // Auto cleanup with component
    }
  }
}
