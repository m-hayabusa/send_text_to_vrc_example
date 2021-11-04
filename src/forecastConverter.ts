// To parse this data:
//
//   import { Convert } from "./file";
//
//   const forecast = Convert.toForecast(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

// https://app.quicktype.io/ で生やした

export interface Forecast {
    officeCode: string;
    name: string;
    srf: Srf;
    week: Week;
}

export interface Srf {
    publishingOffice: string;
    reportDatetime: Date;
    timeSeries: SrfTimeSery[];
}

export interface SrfTimeSery {
    timeDefines: Date[];
    areas: PurpleAreas;
}

export interface PurpleAreas {
    area: Area;
    weatherCodes?: string[];
    weathers?: string[];
    winds?: string[];
    waves?: string[];
    pops?: string[];
    temps?: string[];
}

export interface Area {
    name: string;
    code: string;
}

export interface Week {
    publishingOffice: string;
    reportDatetime: Date;
    timeSeries: WeekTimeSery[];
    tempAverage: PAverage;
    precipAverage: PAverage;
}

export interface PAverage {
    areas: PrecipAverageAreas;
}

export interface PrecipAverageAreas {
    area: Area;
    min: string;
    max: string;
}

export interface WeekTimeSery {
    timeDefines: Date[];
    areas: FluffyAreas;
}

export interface FluffyAreas {
    area: Area;
    weatherCodes?: string[];
    pops?: string[];
    reliabilities?: string[];
    tempsMin?: string[];
    tempsMinUpper?: string[];
    tempsMinLower?: string[];
    tempsMax?: string[];
    tempsMaxUpper?: string[];
    tempsMaxLower?: string[];
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toForecast(json: string): Forecast[] {
        return cast(JSON.parse(json), a(r("Forecast")));
    }

    public static forecastToJson(value: Forecast[]): string {
        return JSON.stringify(uncast(value, a(r("Forecast"))), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`,);
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) { }
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems") ? transformArray(typ.arrayItems, val)
                : typ.hasOwnProperty("props") ? transformObject(getProps(typ), typ.additional, val)
                    : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Forecast": o([
        { json: "officeCode", js: "officeCode", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "srf", js: "srf", typ: r("Srf") },
        { json: "week", js: "week", typ: r("Week") },
    ], false),
    "Srf": o([
        { json: "publishingOffice", js: "publishingOffice", typ: "" },
        { json: "reportDatetime", js: "reportDatetime", typ: Date },
        { json: "timeSeries", js: "timeSeries", typ: a(r("SrfTimeSery")) },
    ], false),
    "SrfTimeSery": o([
        { json: "timeDefines", js: "timeDefines", typ: a(Date) },
        { json: "areas", js: "areas", typ: r("PurpleAreas") },
    ], false),
    "PurpleAreas": o([
        { json: "area", js: "area", typ: r("Area") },
        { json: "weatherCodes", js: "weatherCodes", typ: u(undefined, a("")) },
        { json: "weathers", js: "weathers", typ: u(undefined, a("")) },
        { json: "winds", js: "winds", typ: u(undefined, a("")) },
        { json: "waves", js: "waves", typ: u(undefined, a("")) },
        { json: "pops", js: "pops", typ: u(undefined, a("")) },
        { json: "temps", js: "temps", typ: u(undefined, a("")) },
    ], false),
    "Area": o([
        { json: "name", js: "name", typ: "" },
        { json: "code", js: "code", typ: "" },
    ], false),
    "Week": o([
        { json: "publishingOffice", js: "publishingOffice", typ: "" },
        { json: "reportDatetime", js: "reportDatetime", typ: Date },
        { json: "timeSeries", js: "timeSeries", typ: a(r("WeekTimeSery")) },
        { json: "tempAverage", js: "tempAverage", typ: r("PAverage") },
        { json: "precipAverage", js: "precipAverage", typ: r("PAverage") },
    ], false),
    "PAverage": o([
        { json: "areas", js: "areas", typ: r("PrecipAverageAreas") },
    ], false),
    "PrecipAverageAreas": o([
        { json: "area", js: "area", typ: r("Area") },
        { json: "min", js: "min", typ: "" },
        { json: "max", js: "max", typ: "" },
    ], false),
    "WeekTimeSery": o([
        { json: "timeDefines", js: "timeDefines", typ: a(Date) },
        { json: "areas", js: "areas", typ: r("FluffyAreas") },
    ], false),
    "FluffyAreas": o([
        { json: "area", js: "area", typ: r("Area") },
        { json: "weatherCodes", js: "weatherCodes", typ: u(undefined, a("")) },
        { json: "pops", js: "pops", typ: u(undefined, a("")) },
        { json: "reliabilities", js: "reliabilities", typ: u(undefined, a("")) },
        { json: "tempsMin", js: "tempsMin", typ: u(undefined, a("")) },
        { json: "tempsMinUpper", js: "tempsMinUpper", typ: u(undefined, a("")) },
        { json: "tempsMinLower", js: "tempsMinLower", typ: u(undefined, a("")) },
        { json: "tempsMax", js: "tempsMax", typ: u(undefined, a("")) },
        { json: "tempsMaxUpper", js: "tempsMaxUpper", typ: u(undefined, a("")) },
        { json: "tempsMaxLower", js: "tempsMaxLower", typ: u(undefined, a("")) },
    ], false),
};
