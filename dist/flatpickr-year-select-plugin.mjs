const D = function(i) {
  const a = {
    start: i && i.start !== void 0 ? i.start : 3,
    end: i && i.end !== void 0 ? i.end : 3
  }, r = (/* @__PURE__ */ new Date()).getFullYear(), d = document.createElement("div");
  d.classList.add("flatpickr-current-year");
  const s = document.createElement("select");
  s.classList.add("flatpickr-monthDropdown-years");
  const l = function(e) {
    const t = a.start !== void 0 ? e - a.start : e, o = a.end !== void 0 ? e + a.end : e;
    for (let c = t; c <= o; c++) {
      const n = document.createElement("option");
      n.value = String(c), n.text = String(c), s.appendChild(n);
    }
    s.value = String(e);
  };
  return function(e) {
    if (e) {
      if (e.config.minDate) {
        const t = new Date(e.config.minDate);
        r >= t.getFullYear() && (a.start = r - t.getFullYear());
      }
      if (e.config.maxDate) {
        const t = new Date(e.config.maxDate);
        r <= t.getFullYear() && (a.end = t.getFullYear() - r);
      }
      return e.yearSelectContainer = e._createElement("div", "flatpickr-years", ""), l(r), s.addEventListener("change", function(t) {
        const o = t.target;
        if (!o)
          return;
        const c = o.options[o.selectedIndex].value;
        e.changeYear(Number(c)), e.redraw();
      }), d.append(s), e.yearSelectContainer.append(d), {
        onReady: function() {
          const o = e.monthNav.className, n = e.calendarContainer.getElementsByClassName(o)[0];
          if (!n)
            return;
          n.parentNode.insertBefore(
            e.yearSelectContainer,
            n.parentNode.firstChild
          );
          const u = a.start !== void 0 ? r - a.start : r, m = a.end !== void 0 ? r + a.end : r;
          e.config.minDate || e.set("minDate", `${u}-01-01`), e.config.maxDate || e.set("maxDate", `${m}-12-31`);
        },
        onOpen: function(o, c, n) {
          s.value = String(n.currentYear);
        },
        onYearChange: function(o, c, n) {
          s.value = String(n.currentYear);
        }
      };
    }
  };
};
export {
  D as default
};
//# sourceMappingURL=flatpickr-year-select-plugin.mjs.map
