interface YearDropdownPluginConfig {
    start?: number;
    end?: number;
    [key: string]: number | undefined;
}
declare const yearDropdownPlugin: (pluginConfig?: YearDropdownPluginConfig) => (fp: any) => {
    onReady: () => void;
    onOpen: (_selectedDates: any, _dateStr: any, instance: {
        currentYear: any;
    }) => void;
    onYearChange: (_selectedDates: any, _dateStr: any, instance: {
        currentYear: any;
    }) => void;
} | undefined;
export default yearDropdownPlugin;
