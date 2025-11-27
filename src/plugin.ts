import type { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';
import type { Plugin } from 'flatpickr/dist/types/options';

/**
 * Configuration options for the year dropdown plugin
 */
export interface YearDropdownPluginConfig {
  /** Number of years to show before the current year (default: 3) */
  start?: number;
  /** Number of years to show after the current year (default: 3) */
  end?: number;
}

/**
 * Extended flatpickr instance with year select container
 */
interface ExtendedInstance extends FlatpickrInstance {
  yearSelectContainer?: HTMLElement;
  _createElement: FlatpickrInstance['_createElement'];
  parseDate: FlatpickrInstance['parseDate'];
}

/**
 * Creates a flatpickr plugin that replaces the default year input with a dropdown select
 *
 * @param pluginConfig - Configuration options for the year range
 * @returns A flatpickr plugin function
 *
 * @example
 * ```typescript
 * import flatpickr from 'flatpickr';
 * import yearSelectPlugin from 'flatpickr-year-select-plugin';
 * import 'flatpickr-year-select-plugin/dist/yearSelectPlugin.min.css';
 *
 * flatpickr("#myInput", {
 *   plugins: [
 *     yearSelectPlugin({
 *       start: 5,  // Show 5 years before current
 *       end: 5     // Show 5 years after current
 *     })
 *   ]
 * });
 * ```
 */
const yearDropdownPlugin = function (pluginConfig?: YearDropdownPluginConfig): Plugin {
  const baseConfig: YearDropdownPluginConfig = {
    start: pluginConfig && pluginConfig.start !== undefined ? pluginConfig.start : 3,
    end: pluginConfig && pluginConfig.end !== undefined ? pluginConfig.end : 3,
  };

  return function (fp: FlatpickrInstance) {
    if (!fp) return {};

    const extended = fp as ExtendedInstance;
    const config: YearDropdownPluginConfig = { ...baseConfig };
    const parseDateValue = (value: unknown): Date | undefined => {
      if (!value) return undefined;
      const parseSingle = (val: unknown): Date | undefined => {
        if (!val) return undefined;
        if (val instanceof Date) return isNaN(val.getTime()) ? undefined : val;
        if (typeof val === 'string' || typeof val === 'number') {
          const parsed = extended.parseDate ? extended.parseDate(val) : new Date(val);
          return parsed && !isNaN(parsed.getTime()) ? parsed : undefined;
        }
        return undefined;
      };

      if (Array.isArray(value)) {
        for (const entry of value) {
          const parsed = parseSingle(entry);
          if (parsed) return parsed;
        }
        return undefined;
      }

      return parseSingle(value);
    };

    const getYearBounds = () => {
      const minDate = parseDateValue(extended.config.minDate);
      const maxDate = parseDateValue(extended.config.maxDate);
      const minYearRaw = minDate?.getFullYear();
      const maxYearRaw = maxDate?.getFullYear();
      const minYear =
        minYearRaw !== undefined && maxYearRaw !== undefined
          ? Math.min(minYearRaw, maxYearRaw)
          : minYearRaw;
      const maxYear =
        minYearRaw !== undefined && maxYearRaw !== undefined
          ? Math.max(minYearRaw, maxYearRaw)
          : maxYearRaw;
      return { minYear, maxYear };
    };

    const clampYear = (year: number) => {
      const { minYear, maxYear } = getYearBounds();
      if (minYear !== undefined && year < minYear) return minYear;
      if (maxYear !== undefined && year > maxYear) return maxYear;
      return year;
    };
    const getYearRange = (year: number) => {
      const { minYear, maxYear } = getYearBounds();
      const clampedYear = clampYear(year);
      const rawStart = config.start !== undefined ? clampedYear - config.start : clampedYear;
      const rawEnd = config.end !== undefined ? clampedYear + config.end : clampedYear;
      const start = minYear !== undefined ? Math.max(rawStart, minYear) : rawStart;
      const end = maxYear !== undefined ? Math.min(rawEnd, maxYear) : rawEnd;
      return { clampedYear, start, end };
    };

    const resolveInitialYear = () => {
      const selectedYear = fp.selectedDates?.[0]?.getFullYear();
      const defaultDate = parseDateValue(fp.config.defaultDate);
      const defaultYear =
        defaultDate && !isNaN(defaultDate.getTime()) ? defaultDate.getFullYear() : undefined;

      return clampYear(
        extended.currentYear ?? selectedYear ?? defaultYear ?? new Date().getFullYear()
      );
    };
    const initialYear = resolveInitialYear();

    const yearWrapper = document.createElement('div');
    yearWrapper.classList.add('flatpickr-current-year');
    const yearDropdown = document.createElement('select');
    yearDropdown.classList.add('flatpickr-monthDropdown-years');
    yearDropdown.setAttribute('aria-label', 'Year');
    yearDropdown.setAttribute('name', 'year');
    let suppressNextYearChange = false;

    const createSelectElement = function (year: number) {
      yearDropdown.innerHTML = '';

      const { clampedYear, start, end } = getYearRange(year);

      for (let i = start; i <= end; i++) {
        const option = document.createElement('option');
        option.value = String(i);
        option.text = String(i);
        yearDropdown.appendChild(option);
      }
      yearDropdown.value = String(clampedYear);
      return clampedYear;
    };

    extended.yearSelectContainer = extended._createElement('div', 'flatpickr-years', '');

    createSelectElement(initialYear);

    yearDropdown.addEventListener('change', function (evt) {
      const target = evt.target as HTMLSelectElement;
      if (!target) return;
      const year = target.options[target.selectedIndex].value;

      extended.changeYear(Number(year));
      extended.redraw();
    });

    yearWrapper.append(yearDropdown);
    if (extended.yearSelectContainer) {
      extended.yearSelectContainer.append(yearWrapper);
    }

    return {
      onReady: function onReady() {
        if (!extended.monthNav || !extended.calendarContainer) {
          console.warn('flatpickr-year-select-plugin: Required elements not found');
          return;
        }

        const name = extended.monthNav.className;
        const yearInputCollection = extended.calendarContainer.getElementsByClassName(name);
        const el = yearInputCollection[0];
        if (!el || !el.parentNode || !extended.yearSelectContainer) return;
        el.parentNode.insertBefore(extended.yearSelectContainer, el.parentNode.firstChild);

        const { start, end } = getYearRange(initialYear);

        if (!extended.config.minDate) extended.set('minDate', `${start}-01-01`);
        if (!extended.config.maxDate) extended.set('maxDate', `${end}-12-31`);
      },
      onOpen: function onOpen(
        _selectedDates: Date[],
        _dateStr: string,
        instance: FlatpickrInstance
      ) {
        const clampedYear = createSelectElement(instance.currentYear);
        if (clampedYear !== instance.currentYear) {
          suppressNextYearChange = true;
          extended.changeYear(clampedYear);
          extended.redraw();
          suppressNextYearChange = false;
        }
      },
      onYearChange: function onYearChange(
        _selectedDates: Date[],
        _dateStr: string,
        instance: FlatpickrInstance
      ) {
        if (suppressNextYearChange) {
          suppressNextYearChange = false;
          createSelectElement(instance.currentYear);
          return;
        }
        const clampedYear = createSelectElement(instance.currentYear);
        if (clampedYear !== instance.currentYear) {
          suppressNextYearChange = true;
          extended.changeYear(clampedYear);
          extended.redraw();
          suppressNextYearChange = false;
        }
      },
    };
  };
};

export default yearDropdownPlugin;
