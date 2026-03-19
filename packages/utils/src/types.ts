/** Flatten intersections for better IDE display */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

/** Make all fields non-nullable */
export type NonNullableFields<T> = { [K in keyof T]: NonNullable<T[K]> };

/** Make specific keys optional */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Make specific keys required */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Get value types of an object */
export type ValueOf<T> = T[keyof T];

/** Get typed entries of an object */
export type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][];

/** Value or array of values */
export type MaybeArray<T> = T | T[];

/** Value or Promise of value */
export type MaybePromise<T> = T | Promise<T>;
