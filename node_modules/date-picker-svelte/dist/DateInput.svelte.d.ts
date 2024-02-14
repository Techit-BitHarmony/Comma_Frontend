import { SvelteComponentTyped } from "svelte";
import type { Locale } from './locale.js';
declare const __propDef: {
    props: {
        /** Date value */ value?: Date | null | undefined;
        /** The earliest value the user can select */ min?: Date | undefined;
        /** The latest value the user can select */ max?: Date | undefined;
        /** Set the input element's ID attribute */ id?: string | null | undefined;
        /** Placeholder text to show when input field is empty */ placeholder?: string | undefined;
        /** Whether the text is valid */ valid?: boolean | undefined;
        /** Disable the input **/ disabled?: boolean | undefined;
        /** Require a value to submit form **/ required?: boolean | undefined;
        /** Pass custom classes */ class?: string | undefined;
        /** Format string */ format?: string | undefined;
        /** Locale object for internationalization */ locale?: Locale | undefined;
        text?: string | undefined;
        /** Whether the date popup is visible */ visible?: boolean | undefined;
        /** Close the date popup when a date is selected */ closeOnSelection?: boolean | undefined;
        /** Wait with updating the date until a date is selected */ browseWithoutSelecting?: boolean | undefined;
        /** Show a time picker with the specified precision */ timePrecision?: "minute" | "second" | "millisecond" | null | undefined;
        /** Automatically adjust date popup position to not appear outside the screen */ dynamicPositioning?: boolean | undefined;
    };
    events: {
        select: CustomEvent<Date>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type DateInputProps = typeof __propDef.props;
export type DateInputEvents = typeof __propDef.events;
export type DateInputSlots = typeof __propDef.slots;
export default class DateInput extends SvelteComponentTyped<DateInputProps, DateInputEvents, DateInputSlots> {
}
export {};
