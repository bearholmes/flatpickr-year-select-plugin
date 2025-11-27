/**
 * @jest-environment jsdom
 */

const yearSelectPlugin = require('../dist/flatpickr-year-select-plugin.js');

describe('yearSelectPlugin', () => {
  let mockFlatpickrInstance;
  let container;

  beforeEach(() => {
    // Setup DOM
    container = document.createElement('div');
    document.body.appendChild(container);

    // Mock flatpickr instance
    mockFlatpickrInstance = {
      config: {},
      currentYear: new Date().getFullYear(),
      monthNav: document.createElement('div'),
      calendarContainer: document.createElement('div'),
      _createElement: jest.fn((tag, className) => {
        const el = document.createElement(tag);
        el.className = className;
        return el;
      }),
      set: jest.fn(),
      changeYear: jest.fn(),
      redraw: jest.fn(),
    };

    mockFlatpickrInstance.monthNav.className = 'flatpickr-months';
    mockFlatpickrInstance.calendarContainer.appendChild(mockFlatpickrInstance.monthNav);
  });

  afterEach(() => {
    document.body.removeChild(container);
    jest.clearAllMocks();
  });

  describe('Plugin Configuration', () => {
    it('should create a plugin function', () => {
      const plugin = yearSelectPlugin();
      expect(typeof plugin).toBe('function');
    });

    it('should use default configuration when no config is provided', () => {
      const plugin = yearSelectPlugin();
      const hooks = plugin(mockFlatpickrInstance);

      expect(hooks).toHaveProperty('onReady');
      expect(hooks).toHaveProperty('onOpen');
      expect(hooks).toHaveProperty('onYearChange');
    });

    it('should accept custom start and end values', () => {
      const config = {
        start: 5,
        end: 10,
      };

      const plugin = yearSelectPlugin(config);
      const hooks = plugin(mockFlatpickrInstance);

      hooks?.onReady?.();

      // Check if minDate and maxDate are set correctly
      const currentYear = new Date().getFullYear();
      expect(mockFlatpickrInstance.set).toHaveBeenCalledWith('minDate', `${currentYear - 5}-01-01`);
      expect(mockFlatpickrInstance.set).toHaveBeenCalledWith(
        'maxDate',
        `${currentYear + 10}-12-31`
      );
    });
  });

  describe('DOM Creation', () => {
    it('should create year dropdown elements', () => {
      const plugin = yearSelectPlugin();
      const hooks = plugin(mockFlatpickrInstance);
      hooks?.onReady?.();

      expect(mockFlatpickrInstance._createElement).toHaveBeenCalledWith(
        'div',
        'flatpickr-years',
        ''
      );
    });

    it('should create select element with proper attributes', () => {
      const plugin = yearSelectPlugin();
      const hooks = plugin(mockFlatpickrInstance);
      hooks?.onReady?.();

      const select = mockFlatpickrInstance.yearSelectContainer?.querySelector('select');
      expect(select).toBeTruthy();
      expect(select?.classList.contains('flatpickr-monthDropdown-years')).toBe(true);
      expect(select?.getAttribute('aria-label')).toBe('Year');
      expect(select?.getAttribute('name')).toBe('year');
    });

    it('should create year options based on config', () => {
      const config = {
        start: 2,
        end: 2,
      };

      const plugin = yearSelectPlugin(config);
      const hooks = plugin(mockFlatpickrInstance);
      hooks?.onReady?.();

      const select = mockFlatpickrInstance.yearSelectContainer?.querySelector(
        'select.flatpickr-monthDropdown-years'
      );
      expect(select).toBeTruthy();

      const options = select?.querySelectorAll('option');
      expect(options?.length).toBe(5); // 2 before + current + 2 after
    });
  });

  describe('Multiple Instances', () => {
    it('should create separate DOM elements for each instance', () => {
      const plugin = yearSelectPlugin();

      const instance1 = { ...mockFlatpickrInstance };
      const instance2 = { ...mockFlatpickrInstance };

      instance1._createElement = jest.fn((tag, className) => {
        const el = document.createElement(tag);
        el.className = className;
        el.setAttribute('data-instance', '1');
        return el;
      });

      instance2._createElement = jest.fn((tag, className) => {
        const el = document.createElement(tag);
        el.className = className;
        el.setAttribute('data-instance', '2');
        return el;
      });

      plugin(instance1);
      plugin(instance2);

      // Each instance should have its own createElement call
      expect(instance1._createElement).toHaveBeenCalled();
      expect(instance2._createElement).toHaveBeenCalled();
    });
  });

  describe('Date Constraints', () => {
    it('should respect minDate from flatpickr config', () => {
      mockFlatpickrInstance.config.minDate = '2020-01-01';

      const plugin = yearSelectPlugin();
      const hooks = plugin(mockFlatpickrInstance);
      hooks?.onReady?.();

      const select = mockFlatpickrInstance.yearSelectContainer?.querySelector(
        'select.flatpickr-monthDropdown-years'
      );
      const options = select?.querySelectorAll('option');
      const firstOption = options?.[0];

      expect(Number(firstOption?.value)).toBeGreaterThanOrEqual(2020);
    });

    it('should respect maxDate from flatpickr config', () => {
      mockFlatpickrInstance.config.maxDate = '2030-12-31';

      const plugin = yearSelectPlugin();
      const hooks = plugin(mockFlatpickrInstance);
      hooks?.onReady?.();

      const select = mockFlatpickrInstance.yearSelectContainer?.querySelector(
        'select.flatpickr-monthDropdown-years'
      );
      const options = select?.querySelectorAll('option');
      const lastOption = options?.[options.length - 1];

      expect(Number(lastOption?.value)).toBeLessThanOrEqual(2030);
    });

    it('should handle invalid dates gracefully', () => {
      mockFlatpickrInstance.config.minDate = 'invalid-date';

      const plugin = yearSelectPlugin();

      expect(() => {
        plugin(mockFlatpickrInstance);
      }).not.toThrow();
    });
  });

  describe('Event Handlers', () => {
    it('should call changeYear when select value changes', () => {
      const plugin = yearSelectPlugin();
      const hooks = plugin(mockFlatpickrInstance);
      hooks?.onReady?.();

      const select = mockFlatpickrInstance.yearSelectContainer?.querySelector(
        'select.flatpickr-monthDropdown-years'
      );
      expect(select).toBeTruthy();

      select.value = '2025';
      const event = new Event('change', { bubbles: true });
      select.dispatchEvent(event);

      expect(mockFlatpickrInstance.changeYear).toHaveBeenCalledWith(2025);
      expect(mockFlatpickrInstance.redraw).toHaveBeenCalled();
    });

    it('should update dropdown value on onOpen', () => {
      const plugin = yearSelectPlugin();
      const hooks = plugin(mockFlatpickrInstance);
      hooks?.onReady?.();

      const select = mockFlatpickrInstance.yearSelectContainer?.querySelector(
        'select.flatpickr-monthDropdown-years'
      );

      mockFlatpickrInstance.currentYear = 2023;
      hooks?.onOpen?.([], '', mockFlatpickrInstance);

      expect(select.value).toBe('2023');
    });

    it('should update dropdown value on onYearChange', () => {
      const plugin = yearSelectPlugin();
      const hooks = plugin(mockFlatpickrInstance);
      hooks?.onReady?.();

      const select = mockFlatpickrInstance.yearSelectContainer?.querySelector(
        'select.flatpickr-monthDropdown-years'
      );

      mockFlatpickrInstance.currentYear = 2024;
      hooks?.onYearChange?.([], '', mockFlatpickrInstance);

      expect(select.value).toBe('2024');
    });
  });

  describe('Error Handling', () => {
    it('should return empty object if fp is null', () => {
      const plugin = yearSelectPlugin();
      const hooks = plugin(null);

      expect(hooks).toEqual({});
    });

    it('should warn if required elements are missing', () => {
      mockFlatpickrInstance.monthNav = null;

      const plugin = yearSelectPlugin();
      const hooks = plugin(mockFlatpickrInstance);

      hooks?.onReady?.();

      expect(console.warn).toHaveBeenCalledWith(
        'flatpickr-year-select-plugin: Required elements not found'
      );
    });

    it('should handle missing parent node gracefully', () => {
      const plugin = yearSelectPlugin();
      const hooks = plugin(mockFlatpickrInstance);

      mockFlatpickrInstance.calendarContainer.innerHTML = '';

      expect(() => {
        hooks?.onReady?.();
      }).not.toThrow();
    });
  });

  describe('Year Options', () => {
    it('should clear existing options before creating new ones', () => {
      const plugin = yearSelectPlugin();
      const hooks = plugin(mockFlatpickrInstance);
      hooks?.onReady?.();

      const select = mockFlatpickrInstance.yearSelectContainer?.querySelector(
        'select.flatpickr-monthDropdown-years'
      );

      // Call the function again (simulating dynamic update)
      const hooks2 = plugin(mockFlatpickrInstance);
      hooks2?.onReady?.();

      // Options should exist after multiple plugin calls
      expect(select.options.length).toBeGreaterThan(0);
    });

    it('should set current year as selected by default', () => {
      const plugin = yearSelectPlugin();
      const hooks = plugin(mockFlatpickrInstance);
      hooks?.onReady?.();

      const select = mockFlatpickrInstance.yearSelectContainer?.querySelector(
        'select.flatpickr-monthDropdown-years'
      );
      const currentYear = new Date().getFullYear();

      expect(select.value).toBe(String(currentYear));
    });
  });
});
