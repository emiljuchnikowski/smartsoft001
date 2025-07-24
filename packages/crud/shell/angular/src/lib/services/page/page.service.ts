import {Injectable} from "@angular/core";
import {AuthService} from "@smartsoft001/angular";
import {getModelOptions} from "@smartsoft001/models";

import { CrudFullConfig } from "../../crud.config";

@Injectable()
export class PageService<T> {
    constructor(
        private authService: AuthService,
        private config: CrudFullConfig<T>
    ) { }

    checkPermissions(): void {
        const val: CrudFullConfig<T> = this.config;
        const modelOptions = getModelOptions(val.type);

        if (
            val.add &&
            modelOptions.create &&
            modelOptions.create.permissions &&
            !this.authService.expectPermissions(modelOptions.create.permissions)
        ) {
            val.add = false;
        }

        if (
            val.edit &&
            modelOptions.update &&
            modelOptions.update.permissions &&
            !this.authService.expectPermissions(modelOptions.update.permissions)
        ) {
            val.edit = false;
        }

        if (
            val.remove &&
            modelOptions.remove &&
            modelOptions.remove.permissions &&
            !this.authService.expectPermissions(modelOptions.remove.permissions)
        ) {
            val.remove = false;
        }
    }
}