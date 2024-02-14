import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        browseDate: Date;
        timePrecision: 'minute' | 'second' | 'millisecond' | null;
        browse: (d: Date) => void;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type TimePickerProps = typeof __propDef.props;
export type TimePickerEvents = typeof __propDef.events;
export type TimePickerSlots = typeof __propDef.slots;
export default class TimePicker extends SvelteComponentTyped<TimePickerProps, TimePickerEvents, TimePickerSlots> {
}
export {};
