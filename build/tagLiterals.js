import { toLiteral } from "./toLiteral.js";
export function tagLiterals(arg, ...args) {
    // return the templated string
    if (Array.isArray(arg)) {
        return arg.reduce((out, s) => out + s + (args.length ? toLiteral(args.shift()) : ""), "");
    }
    // return a template function with options
    return (strings, ..._args) => {
        return strings.reduce((out, s) => out + s + (_args.length ? toLiteral(_args.shift(), arg) : ""), "");
    };
}
