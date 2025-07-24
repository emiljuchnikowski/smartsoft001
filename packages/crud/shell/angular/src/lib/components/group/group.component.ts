import {ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';

import {BaseComponent, IListOptions, StyleService} from "@smartsoft001/angular";
import {IEntity} from "@smartsoft001/domain-core";

import {ICrudListGroup} from "../../models/interfaces";
import {CrudFacade} from "../../+state/crud.facade";
import {CrudListGroupService} from "../../services/list-group/list-group.service";

@Component({
    selector: 'smart-crud-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss']
})
export class GroupComponent<T extends IEntity<string>> extends BaseComponent implements OnInit, OnDestroy {
    @Input() groups: Array<ICrudListGroup>;
    @Input() listOptions: IListOptions<T>;

    constructor(
        private styleService: StyleService,
        private elementRef: ElementRef,
        private facade: CrudFacade<T>,
        private cd: ChangeDetectorRef,
        private groupService: CrudListGroupService<T>
    ) {
        super();
    }

    change(val, item: ICrudListGroup, force = false): void {
        this.groups.filter(i => i.value !== item.value || i.key !== item.key).forEach(i => {
            i.show = false;
        });

        this.groupService.change(val, item, this.groups, force);

        if (val) {
            setTimeout(() => {
                item.show = val;
                this.cd.detectChanges();
            });
        } else {
            item.show = val;
            this.cd.detectChanges();
        }
    }

    ngOnInit(): void {
        this.styleService.init(this.elementRef);
    }

    ngOnDestroy(): void {
        this.groupService.destroy(this.groups);
        super.ngOnDestroy();
    }
}
