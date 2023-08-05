interface YearDropdownPluginConfig {
  start?: number;
  end?: number;
  [key: string]: number | undefined;
}

const yearDropdownPlugin = function (pluginConfig?: YearDropdownPluginConfig) {
  const config: YearDropdownPluginConfig = {
    start:
      pluginConfig && pluginConfig.start !== undefined ? pluginConfig.start : 3,
    end: pluginConfig && pluginConfig.end !== undefined ? pluginConfig.end : 3,
  };

  const currYear = new Date().getFullYear();

  const yearWrapper = document.createElement("div");
  yearWrapper.classList.add("flatpickr-current-year");
  const yearDropdown = document.createElement("select");
  yearDropdown.classList.add("flatpickr-monthDropdown-years");

  //function (_year: number)
  const createSelectElement = function (year: number) {
    const start = config.start !== undefined ? year - config.start : year;
    const end = config.end !== undefined ? year + config.end : year;

    for (let i = start; i <= end; i++) {
      const option = document.createElement("option");
      option.value = String(i);
      option.text = String(i);
      yearDropdown.appendChild(option);
    }
    yearDropdown.value = String(year);
  };

  return function (fp: any) {
    if (!fp) return;
    if (fp.config.minDate) {
      const minDate = new Date(fp.config.minDate);
      if (currYear >= minDate.getFullYear())
        config.start = currYear - minDate.getFullYear();
    }
    if (fp.config.maxDate) {
      const maxDate = new Date(fp.config.maxDate);
      if (currYear <= maxDate.getFullYear())
        config.end = maxDate.getFullYear() - currYear;
    }

    fp.yearSelectContainer = fp._createElement("div", "flatpickr-years", "");

    // fp.yearSelectContainer.tabIndex = -1;
    createSelectElement(currYear);

    yearDropdown.addEventListener("change", function (evt) {
      const target = evt.target as HTMLSelectElement;
      if (!target) return;
      const year = target.options[target.selectedIndex].value;

      fp.changeYear(Number(year));
      fp.redraw();
    });

    yearWrapper.append(yearDropdown);
    fp.yearSelectContainer.append(yearWrapper);

    return {
      onReady: function onReady() {
        const name = fp.monthNav.className;
        const yearInputCollection =
          fp.calendarContainer.getElementsByClassName(name);
        const el = yearInputCollection[0];
        if (!el) return;
        el.parentNode.insertBefore(
          fp.yearSelectContainer,
          el.parentNode.firstChild
        );

        const start =
          config.start !== undefined ? currYear - config.start : currYear;
        const end = config.end !== undefined ? currYear + config.end : currYear;

        if (!fp.config.minDate) fp.set("minDate", `${start}-01-01`);
        if (!fp.config.maxDate) fp.set("maxDate", `${end}-12-31`);
      },
      onOpen: function onOpen(
        _selectedDates: any,
        _dateStr: any,
        instance: { currentYear: any }
      ) {
        yearDropdown.value = String(instance.currentYear);
      },
      onYearChange: function onYearChange(
        _selectedDates: any,
        _dateStr: any,
        instance: { currentYear: any }
      ) {
        yearDropdown.value = String(instance.currentYear);
      },
    };
  };
};

export default yearDropdownPlugin;
