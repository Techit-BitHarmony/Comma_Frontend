import { ZodString, ZodNumber, z, ZodArray, ZodTypeAny, ZodEffects, ZodObject } from 'zod';

type InputType<DefaultType extends ZodTypeAny> = {
    (): ZodEffects<DefaultType>;
    <ProvidedType extends ZodTypeAny>(schema: ProvidedType): ZodEffects<ProvidedType>;
};
/**
 * Transforms any empty strings to `undefined` before validating.
 * This makes it so empty strings will fail required checks,
 * allowing you to use `optional` for optional fields instead of `nonempty` for required fields.
 * If you call `zfd.text` with no arguments, it will assume the field is a required string by default.
 * If you want to customize the schema, you can pass that as an argument.
 */
declare const text: InputType<ZodString>;
/**
 * Coerces numerical strings to numbers transforms empty strings to `undefined` before validating.
 * If you call `zfd.number` with no arguments,
 * it will assume the field is a required number by default.
 * If you want to customize the schema, you can pass that as an argument.
 */
declare const numeric: InputType<ZodNumber>;
type CheckboxOpts = {
    trueValue?: string;
};
/**
 * Turns the value from a checkbox field into a boolean,
 * but does not require the checkbox to be checked.
 * For checkboxes with a `value` attribute, you can pass that as the `trueValue` option.
 *
 * @example
 * ```ts
 * const schema = zfd.formData({
 *   defaultCheckbox: zfd.checkbox(),
 *   checkboxWithValue: zfd.checkbox({ trueValue: "true" }),
 *   mustBeTrue: zfd
 *     .checkbox()
 *     .refine((val) => val, "Please check this box"),
 *   });
 * });
 * ```
 */
declare const checkbox: ({ trueValue }?: CheckboxOpts) => z.ZodUnion<[z.ZodEffects<z.ZodLiteral<string>, boolean, string>, z.ZodEffects<z.ZodLiteral<undefined>, boolean, undefined>]>;
declare const file: InputType<z.ZodType<File>>;
/**
 * Preprocesses a field where you expect multiple values could be present for the same field name
 * and transforms the value of that field to always be an array.
 * If you don't provide a schema, it will assume the field is an array of zfd.text fields
 * and will not require any values to be present.
 */
declare const repeatable: InputType<ZodArray<any>>;
/**
 * A convenience wrapper for repeatable.
 * Instead of passing the schema for an entire array, you pass in the schema for the item type.
 */
declare const repeatableOfType: <T extends z.ZodTypeAny>(schema: T) => z.ZodEffects<z.ZodArray<T, "many">, T["_output"][], T["_input"][]>;
type FormDataLikeInput = {
    [Symbol.iterator](): IterableIterator<[string, FormDataEntryValue]>;
    entries(): IterableIterator<[string, FormDataEntryValue]>;
};
type FormDataType = {
    <T extends z.ZodRawShape>(shape: T): ZodEffects<ZodObject<T>, z.output<ZodObject<T>>, FormData | FormDataLikeInput>;
    <T extends z.ZodTypeAny>(schema: T): ZodEffects<T, z.output<T>, FormData | FormDataLikeInput>;
};
declare const json: <T extends z.ZodTypeAny>(schema: T) => z.ZodEffects<T, z.output<T>, z.input<T>>;
declare const preprocessFormData: (formData: unknown) => Record<string, unknown>;
/**
 * This helper takes the place of the `z.object` at the root of your schema.
 * It wraps your schema in a `z.preprocess` that extracts all the data out of a `FormData`
 * and transforms it into a regular object.
 * If the `FormData` contains multiple entries with the same field name,
 * it will automatically turn that field into an array.
 */
declare const formData: FormDataType;

declare const helpers_text: typeof text;
declare const helpers_numeric: typeof numeric;
declare const helpers_checkbox: typeof checkbox;
declare const helpers_file: typeof file;
declare const helpers_repeatable: typeof repeatable;
declare const helpers_repeatableOfType: typeof repeatableOfType;
declare const helpers_json: typeof json;
declare const helpers_preprocessFormData: typeof preprocessFormData;
declare const helpers_formData: typeof formData;
declare namespace helpers {
  export {
    helpers_text as text,
    helpers_numeric as numeric,
    helpers_checkbox as checkbox,
    helpers_file as file,
    helpers_repeatable as repeatable,
    helpers_repeatableOfType as repeatableOfType,
    helpers_json as json,
    helpers_preprocessFormData as preprocessFormData,
    helpers_formData as formData,
  };
}

export { checkbox, file, formData, json, numeric, preprocessFormData, repeatable, repeatableOfType, text, helpers as zfd };
