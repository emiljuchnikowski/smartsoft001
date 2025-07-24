import { Component, Input, OnInit } from "@angular/core";

import {FieldType, IModelFilter} from "@smartsoft001/models";

import {ICrudFilter} from "../../models/interfaces";

@Component({
  selector: "smart-crud-filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.scss"],
})
export class FilterComponent implements OnInit {
  FieldType = FieldType;

  @Input() item: IModelFilter;
  @Input() filter: ICrudFilter;

  constructor() {}

  ngOnInit(): void {}
}
