import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ButtonComponent } from '../../button/button.component';
import { PageBaseComponent } from '../base/base.component';

const noop = () => undefined;

@Component({
  selector: 'smart-page-standard',
  template: `
    @if (!options()?.hideHeader) {
      <div
        class="smart:md:flex smart:md:items-center smart:md:justify-between smart:px-4 smart:py-4 sm:smart:px-6 lg:smart:px-8"
      >
        <div class="smart:min-w-0 smart:flex-1">
          <div class="smart:flex smart:items-center smart:gap-x-3">
            @if (options()?.showBackButton) {
              <button
                type="button"
                (click)="back()"
                class="smart:inline-flex smart:items-center smart:rounded-md smart:p-1.5 smart:text-gray-400 hover:smart:text-gray-500 smart:dark:text-gray-500 dark:hover:smart:text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="smart:size-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            }
            <h2
              class="smart:text-2xl/7 smart:font-bold smart:text-gray-900 sm:smart:truncate sm:smart:text-3xl sm:smart:tracking-tight smart:dark:text-white"
            >
              {{ options()?.title ?? '' | translate }}
            </h2>
          </div>
        </div>
        @if (options()?.endButtons?.length || options()?.search) {
          <div
            class="smart:mt-4 smart:flex smart:shrink-0 smart:gap-x-2 md:smart:ml-4 md:smart:mt-0"
          >
            @if (options()?.search; as search) {
              <div class="smart:relative smart:rounded-md smart:shadow-xs">
                <input
                  type="text"
                  [value]="search.text() ?? ''"
                  (input)="search.set($any($event.target).value)"
                  [placeholder]="'search' | translate"
                  class="smart:block smart:w-full smart:rounded-md smart:border-0 smart:py-1.5 smart:pl-3 smart:pr-10 smart:text-gray-900 smart:ring-1 smart:ring-inset smart:ring-gray-300 placeholder:smart:text-gray-400 focus:smart:ring-2 focus:smart:ring-inset focus:smart:ring-indigo-600 sm:smart:text-sm/6 smart:dark:bg-white/5 smart:dark:text-white smart:dark:ring-white/10 dark:placeholder:smart:text-gray-500"
                />
              </div>
            }
            @for (btn of options()?.endButtons ?? []; track btn.icon) {
              <smart-button
                [options]="getButtonOptions(btn)"
                [disabled]="!!(btn.disabled$ | async)"
              >
                @if (btn.text) {
                  {{ btn.text | translate }}
                }
                @if (btn.number) {
                  <span
                    class="smart:ml-1 smart:inline-flex smart:items-center smart:rounded-full smart:bg-indigo-100 smart:px-2 smart:py-0.5 smart:text-xs smart:font-medium smart:text-indigo-700 smart:dark:bg-indigo-500/10 smart:dark:text-indigo-400"
                    >{{ btn.number }}</span
                  >
                }
              </smart-button>
            }
          </div>
        }
      </div>
    }
    <div class="smart:px-4 sm:smart:px-6 lg:smart:px-8">
      @if (options()?.bodyTpl; as bodyTpl) {
        <ng-container [ngTemplateOutlet]="bodyTpl"></ng-container>
      }
    </div>
  `,
  imports: [TranslatePipe, ButtonComponent, AsyncPipe, NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageStandardComponent extends PageBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');

  getButtonOptions(btn: { handler?: () => void }) {
    return {
      click: btn.handler ?? noop,
      variant: 'secondary' as const,
      size: 'md' as const,
    };
  }
}
