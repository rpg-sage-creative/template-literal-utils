import { isDate } from "util/types";
function testKeyPath(keyPath, ellipses) {
    if (keyPath.length && ellipses?.length) {
        for (const el of ellipses) {
            const elPath = el.split(".");
            if (keyPath.length === elPath.length) {
                for (let i = 0; i < keyPath.length; i++) {
                    if (keyPath[i] !== elPath[i] && elPath[i] !== "*") {
                        return false;
                    }
                }
                return true;
            }
        }
    }
    return false;
}
export function toLiteral(value, options, keyPath = []) {
    if (value === null)
        return "null";
    if (value === undefined)
        return "undefined";
    if (Array.isArray(value)) {
        if (testKeyPath(keyPath, options?.ellipses)) {
            return "[…]";
        }
        return `[${value.map((value, i) => toLiteral(value, options, keyPath.concat([`${i}`]))).join(",")}]`;
    }
    if (isDate(value)) {
        return `Date("${value.toISOString()}")`;
    }
    if (value instanceof Map) {
        if (testKeyPath(keyPath, options?.ellipses)) {
            return `Map([…])`;
        }
        return `Map(${toLiteral(Array.from(value.entries()))})`;
    }
    if (value instanceof RegExp) {
        return `/${value.source}/${value.flags}`;
    }
    if (value instanceof Set) {
        if (testKeyPath(keyPath, options?.ellipses)) {
            return `Set([…])`;
        }
        return `Set(${toLiteral([...value.values()])})`;
    }
    switch (typeof (value)) {
        case "bigint":
            return `${value}n`;
        case "object":
            if (testKeyPath(keyPath, options?.ellipses)) {
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
