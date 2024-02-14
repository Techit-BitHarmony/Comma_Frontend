import { SvelteComponentTyped } from "svelte";
import { type Locale } from './locale.js';
declare const __propDef: {
    props: {
        /** Date value. It's `null` if no date is selected */ value?: Date | null | undefined;
        /** Show a time picker with the specified precision */ timePrecision?: "minute" | "second" | "millisecond" | null | undefined;
        /** The earliest year the user can select */ min?: Date | undefined;
        /** The latest year the user can select */ max?: Date | undefined;
        /** Locale object for internationalization */ locale?: Locale | undefined;
        /** Wait with updating the date until a date is selected */ browseWithoutSelecting?: boolean | undefined;
    };
    events: {
        focusout: FocusEvent;
        select: CustomEvent<Date>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type DatePickerProps = typeof __propDef.props;
export type DatePickerEvents = typeof __propDef.events;
export type DatePickerSlots = typeof __propDef.slots;
export default class DatePicker extends SvelteComponentTyped<DatePickerProps, DatePickerEvents, DatePickerSlots> {
}
export {};
