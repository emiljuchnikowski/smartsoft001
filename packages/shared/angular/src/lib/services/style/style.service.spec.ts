import { StyleService } from './style.service';

describe('angular: StyleService', () => {
  let platformMock: any;
  let elementRefMock: any;
  let nativeElementMock: any;
  let setPropertyMock: any;
  let platformIdMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    setPropertyMock = jest.fn();
    nativeElementMock = { style: { setProperty: setPropertyMock } };
    elementRefMock = { nativeElement: nativeElementMock };
    platformMock = { is: jest.fn() };
    platformIdMock = {};
    StyleService.style = null;
  });

  describe('create', () => {
    it('should create a new instance and call init with provided element and style', () => {
      const initSpy = jest.spyOn(StyleService.prototype, 'init');
      const style = { 'color-primary': '#fff' };
      const instance = StyleService.create(
        platformMock,
        platformIdMock,
        elementRefMock,
        style,
      );
      expect(initSpy).toHaveBeenCalledWith(elementRefMock, style);
      initSpy.mockRestore();
    });
    it('should return an instance of StyleService', () => {
      const instance = StyleService.create(
        platformMock,
        platformIdMock,
        elementRefMock,
      );
      expect(instance).toBeInstanceOf(StyleService);
    });
  });

  describe('init', () => {
    it('should set _elementRef and call set with provided style', () => {
      const setSpy = jest.spyOn(StyleService.prototype, 'set');
      const service = new StyleService(platformMock, platformIdMock);
      const style = { 'color-primary': '#fff' };
      service.init(elementRefMock, style);
      expect((service as any)._elementRef).toBe(elementRefMock);
      expect(setSpy).toHaveBeenCalledWith(style);
      setSpy.mockRestore();
    });
    it('should call set with undefined if style is not provided', () => {
      const setSpy = jest.spyOn(StyleService.prototype, 'set');
      const service = new StyleService(platformMock, platformIdMock);
      service.init(elementRefMock);
      expect(setSpy).toHaveBeenCalledWith(undefined);
      setSpy.mockRestore();
    });
  });

  describe('set', () => {
    it('should update static style property', () => {
      const service = new StyleService(platformMock, platformIdMock);
      service.init(elementRefMock);
      service.set({ 'color-primary': '#fff' });
      expect(StyleService.style!['color-primary']).toBe('#fff');
    });
    it('should call execute', () => {
      const service = new StyleService(platformMock, platformIdMock);
      service.init(elementRefMock);
      const executeSpy = jest.spyOn(service as any, 'execute');
      service.set({});
      expect(executeSpy).toHaveBeenCalled();
      executeSpy.mockRestore();
    });
    it('should merge new style with previous static style', () => {
      const service = new StyleService(platformMock, platformIdMock);
      service.init(elementRefMock);
      StyleService.style = {
        'color-primary': '#111',
        'color-secondary': '#222',
      };
      service.set({ 'color-primary': '#fff' });
      expect(StyleService.style!['color-primary']).toBe('#fff');
      expect(StyleService.style!['color-secondary']).toBe('#222');
    });
  });

  describe('setProperty', () => {
    it('should call nativeElement.style.setProperty for each style property', () => {
      const service = new StyleService(platformMock, platformIdMock);
      service.init(elementRefMock);
      StyleService.style = { 'color-primary': '#fff' };
      service['setProperty']('--smart-color-primary', 'color-primary');
      expect(setPropertyMock).toHaveBeenCalledWith(
        '--smart-color-primary',
        '#fff',
      );
    });
    it('should not call setProperty if style or value is missing', () => {
      const service = new StyleService(platformMock, platformIdMock);
      service.init(elementRefMock);
      StyleService.style = null;
      service['setProperty']('--smart-color-primary', 'color-primary');
      expect(setPropertyMock).not.toHaveBeenCalled();
    });
  });

  describe('setFont', () => {
    it('should set font properties for other platforms', () => {
      platformMock.is.mockReturnValue(false);
      const service = new StyleService(platformMock, platformIdMock);
      service.init(elementRefMock);
      StyleService.style = {
        font: 'fontC',
        'font-weight': '100',
        'font-style': 'normal',
      };
      service['setFont']();
      expect(setPropertyMock).toHaveBeenCalledWith(
        '--ion-font-family',
        'fontC',
      );
      expect(setPropertyMock).toHaveBeenCalledWith(
        '--default-font-weight',
        '100',
      );
      expect(setPropertyMock).toHaveBeenCalledWith(
        '--default-font-style',
        'normal',
      );
    });
  });

  describe('setButton', () => {
    it('should set button properties', () => {
      const service = new StyleService(platformMock, platformIdMock);
      service.init(elementRefMock);
      StyleService.style = {
        'button-height': '10px',
        'button-min-width': '20px',
      };
      service['setButton']();
      expect(setPropertyMock).toHaveBeenCalledWith(
        '--smart-button-height',
        '10px',
      );
      expect(setPropertyMock).toHaveBeenCalledWith(
        '--smart-button-min-width',
        '20px',
      );
    });
  });

  describe('setMobileBreakpoint', () => {
    it('should set mobile breakpoint properties', () => {
      const service = new StyleService(platformMock, platformIdMock);
      service.init(elementRefMock);
      StyleService.style = {
        'phone-breakpoint': '400px',
        'tablet-breakpoint': '800px',
      };
      service['setMobileBreakpoint']();
      expect(setPropertyMock).toHaveBeenCalledWith(
        '--phone-breakpoint',
        '400px',
      );
      expect(setPropertyMock).toHaveBeenCalledWith(
        '--tablet-breakpoint',
        '800px',
      );
    });
  });
});
