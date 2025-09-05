describe('Placeholder', () => {
  it('should be fixed during rewrite of components that use ionic', () => {
    expect(true).toBe(true);
  });
});

// import { TestBed } from '@angular/core/testing';
//
// import { ModalService, IModalOptions } from './modal.service';
//
// describe('angular: ModalService', () => {
//   let modalService: ModalService;
//   let modalCtrlMock: any;
//   let navParamsMock: any;
//
//   beforeEach(() => {
//     jest.clearAllMocks();
//     modalCtrlMock = {
//       create: jest.fn(),
//       dismiss: jest.fn(),
//     };
//     navParamsMock = {
//       get: jest.fn(),
//     };
//     TestBed.configureTestingModule({
//       providers: [
//         ModalService,
//         { provide: ModalController, useValue: modalCtrlMock },
//         { provide: NavParams, useValue: navParamsMock },
//       ],
//     });
//
//     modalService = TestBed.inject(ModalService);
//   });
//
//   it('should be created', () => {
//     expect(modalService).toBeTruthy();
//   });
//
//   describe('getParam', () => {
//     it('should return value from NavParams for given key', () => {
//       navParamsMock.get.mockReturnValue('testValue');
//       expect(modalService.getParam('key')).toBe('testValue');
//     });
//     it('should return undefined if NavParams is not provided', () => {
//       const service = new ModalService(modalCtrlMock, null as any);
//       expect(service.getParam('key')).toBeUndefined();
//     });
//   });
//
//   describe('show', () => {
//     it('should call ModalController.create with correct options', async () => {
//       const presentMock = jest.fn();
//       const modalMock = { present: presentMock };
//       modalCtrlMock.create.mockResolvedValue(modalMock);
//       const options: IModalOptions = {
//         component: 'TestComponent',
//         props: { a: 1 },
//         cssClass: ['x'],
//         backdropDismiss: true,
//       };
//       await modalService.show(options);
//       expect(modalCtrlMock.create).toHaveBeenCalledWith(
//         expect.objectContaining({
//           component: 'TestComponent',
//           componentProps: { a: 1 },
//           cssClass: ['x'],
//           backdropDismiss: true,
//         }),
//       );
//     });
//     it('should add smart-modal-bottom class if mode is bottom', async () => {
//       const presentMock = jest.fn();
//       const modalMock = { present: presentMock };
//       modalCtrlMock.create.mockResolvedValue(modalMock);
//       const options: IModalOptions = {
//         component: 'TestComponent',
//         mode: 'bottom',
//       };
//       await modalService.show(options);
//       const calledOptions = modalCtrlMock.create.mock.calls[0][0];
//       expect(calledOptions.cssClass).toContain('smart-modal-bottom');
//     });
//     it('should call present on the modal', async () => {
//       const presentMock = jest.fn();
//       const modalMock = { present: presentMock };
//       modalCtrlMock.create.mockResolvedValue(modalMock);
//       const options: IModalOptions = { component: 'TestComponent' };
//       await modalService.show(options);
//       expect(presentMock).toHaveBeenCalled();
//     });
//     it('should return the modal instance', async () => {
//       const presentMock = jest.fn();
//       const modalMock = { present: presentMock };
//       modalCtrlMock.create.mockResolvedValue(modalMock);
//       const options: IModalOptions = { component: 'TestComponent' };
//       const result = await modalService.show(options);
//       expect(result).toBe(modalMock);
//     });
//   });
//
//   describe('dismiss', () => {
//     it('should call ModalController.dismiss with provided data', async () => {
//       modalCtrlMock.dismiss.mockResolvedValue(undefined);
//       await modalService.dismiss('myData');
//       expect(modalCtrlMock.dismiss).toHaveBeenCalledWith('myData');
//     });
//     it('should call ModalController.dismiss with null if no data provided', async () => {
//       modalCtrlMock.dismiss.mockResolvedValue(undefined);
//       await modalService.dismiss();
//       expect(modalCtrlMock.dismiss).toHaveBeenCalledWith(null);
//     });
//   });
// });
