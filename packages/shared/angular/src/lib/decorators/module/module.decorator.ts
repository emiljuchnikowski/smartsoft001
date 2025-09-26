import { NgModule } from '@angular/core';

export const SmartNgModule = SmartNgModuleDecorator;
export function SmartNgModuleDecorator(options: NgModule) {
  return (constructor: any) => {
    return NgModule(options)(constructor);
  };
}
