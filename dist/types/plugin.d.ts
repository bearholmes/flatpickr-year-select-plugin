import { Plugin } from 'flatpickr/dist/types/options';
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
declare const yearDropdownPlugin: (pluginConfig?: YearDropdownPluginConfig) => Plugin;
export default yearDropdownPlugin;
