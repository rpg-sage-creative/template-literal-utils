import { isDate } from "util/types";
export function toLiteral(value, options, keyPath = []) {
    if (value === null)
        return "null";
    if (value === undefined)
        return "undefined";
    const doEllipses = () => options?.ellipses?.includes(keyPath.join("."));
    if (Array.isArray(value)) {
        if (doEllipses()) {
            return "[…]";
        }
        return `[${value.map((value, i) => toLiteral(value, options, keyPath.concat([`${i}`]))).join(",")}]`;
    }
    if (isDate(value)) {
        return `Date("${value.toISOString()}")`;
    }
    if (value instanceof Map) {
        if (doEllipses()) {
            return `Map([…])`;
        }
        return `Map(${toLiteral(Array.from(value.entries()))})`;
    }
    if (value instanceof RegExp) {
        return `/${value.source}/${value.flags}`;
    }
    if (value instanceof Set) {
        if (doEllipses()) {
            return `Set([…])`;
        }
        return `Set(${toLiteral([...value.values()])})`;
    }
    switch (typeof (value)) {
        case "bigint":
            return `${value}n`;
        case "object":
            if (doEllipses()) {
                return "{…}";
            }
            const entries = [...Object.entries(value)];
            const mapped = entries.map(([key, val]) => `${toLiteral(key)}:${toLiteral(val, options, keyPath.concat([key]))}`);
            return `{${mapped.join(",")}}`;
        case "string":
            return JSON.stringify(value);
        default:
            return String(value);
    }
}
