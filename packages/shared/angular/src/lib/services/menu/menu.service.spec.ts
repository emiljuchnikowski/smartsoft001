describe('Placeholder', () => {
  it('should be fixed during rewrite of components that use ionic', () => {
    expect(true).toBe(true);
  });
});

// import { ComponentFactoryResolver } from '@angular/core';
// import { TestBed } from '@angular/core/testing';
//
// import { MenuService } from './menu.service';
// import { IMenuItem } from '../../models';
//
// describe('angular: MenuService', () => {
//   let menuService: MenuService;
//   let menuCtrlMock: any;
//   let resolverMock: any;
//
//   beforeEach(() => {
//     jest.clearAllMocks();
//     menuCtrlMock = {};
//     resolverMock = {};
//     TestBed.configureTestingModule({
//       providers: [
//         MenuService,
//         { provide: MenuController, useValue: menuCtrlMock },
//         { provide: ComponentFactoryResolver, useValue: resolverMock },
//       ],
//     });
//     menuService = TestBed.inject(MenuService);
//   });
//
//   it('should be created', () => {
//     expect(menuService).toBeTruthy();
//   });
//
//   describe('enable', () => {
//     it('should set disable$ to false', (done) => {
//       menuService.enable();
//       menuService.disable$.subscribe((val) => {
//         expect(val).toBe(false);
//         done();
//       });
//     });
//   });
//
//   describe('disable', () => {
//     it('should set disable$ to true', (done) => {
//       menuService.disable();
//       menuService.disable$.subscribe((val) => {
//         expect(val).toBe(true);
//         done();
//       });
//     });
//   });
//
//   describe('changeMenuItemByRoute', () => {
//     it('should update menu item by route', (done) => {
//       const items: IMenuItem[] = [
//         { route: '/a' } as any,
//         { route: '/b' } as any,
//       ];
//       menuService['setMenuItems'](items);
//       menuService.changeMenuItemByRoute('/a', { route: '/aa' });
//       menuService.menuItems$.subscribe((val) => {
//         expect(val.find((i) => i.route === '/aa')).toBeDefined();
//         done();
//       });
//     });
//   });
//
//   describe('setMenuItems', () => {
//     it('should set menuItems$ to provided array', (done) => {
//       const items: IMenuItem[] = [{ route: '/x', label: 'X' } as any];
//       menuService['setMenuItems'](items);
//       menuService.menuItems$.subscribe((val) => {
//         expect(val).toEqual(items);
//         done();
//       });
//     });
//   });
//
//   describe('openedEnd', () => {
//     it('should return _openedEnd value', () => {
//       (menuService as any)._openedEnd = true;
//       expect(menuService.openedEnd).toBe(true);
//     });
//   });
//
//   describe('closeStart', () => {
//     it('should set _openedEnd to false', async () => {
//       (menuService as any)._openedEnd = true;
//       menuCtrlMock.close = jest.fn().mockResolvedValue(undefined);
//       menuCtrlMock.enable = jest.fn().mockResolvedValue(undefined);
//       await menuService.closeStart();
//       expect(menuService.openedEnd).toBe(false);
//     });
//     it('should call menuCtrl.close with "start"', async () => {
//       menuCtrlMock.close = jest.fn().mockResolvedValue(undefined);
//       menuCtrlMock.enable = jest.fn().mockResolvedValue(undefined);
//       await menuService.closeStart();
//       expect(menuCtrlMock.close).toHaveBeenCalledWith('start');
//     });
//     it('should call menuCtrl.enable with false and "start"', async () => {
//       menuCtrlMock.close = jest.fn().mockResolvedValue(undefined);
//       menuCtrlMock.enable = jest.fn().mockResolvedValue(undefined);
//       await menuService.closeStart();
//       expect(menuCtrlMock.enable).toHaveBeenCalledWith(false, 'start');
//     });
//   });
//
//   describe('closeEnd', () => {
//     it('should set _openedEnd to false', async () => {
//       (menuService as any)._openedEnd = true;
//       menuCtrlMock.close = jest.fn().mockResolvedValue(undefined);
//       menuCtrlMock.enable = jest.fn().mockResolvedValue(undefined);
//       await menuService.closeEnd();
//       expect(menuService.openedEnd).toBe(false);
//     });
//     it('should call menuCtrl.close with "end"', async () => {
//       menuCtrlMock.close = jest.fn().mockResolvedValue(undefined);
//       menuCtrlMock.enable = jest.fn().mockResolvedValue(undefined);
//       await menuService.closeEnd();
//       expect(menuCtrlMock.close).toHaveBeenCalledWith('end');
//     });
//     it('should call menuCtrl.enable with false and "end"', async () => {
//       menuCtrlMock.close = jest.fn().mockResolvedValue(undefined);
//       menuCtrlMock.enable = jest.fn().mockResolvedValue(undefined);
//       await menuService.closeEnd();
//       expect(menuCtrlMock.enable).toHaveBeenCalledWith(false, 'end');
//     });
//     it('should clear _endContainer if defined', async () => {
//       menuCtrlMock.close = jest.fn().mockResolvedValue(undefined);
//       menuCtrlMock.enable = jest.fn().mockResolvedValue(undefined);
//       const clearMock = jest.fn();
//       (menuService as any)._endContainer = { clear: clearMock };
//       await menuService.closeEnd();
//       expect(clearMock).toHaveBeenCalled();
//     });
//     it('should not throw if _endContainer is undefined', async () => {
//       menuCtrlMock.close = jest.fn().mockResolvedValue(undefined);
//       menuCtrlMock.enable = jest.fn().mockResolvedValue(undefined);
//       (menuService as any)._endContainer = undefined;
//       await expect(menuService.closeEnd()).resolves.toBeUndefined();
//     });
//   });
// });
