import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
// @ts-ignore
type MatcherParam<M> = M extends (param : string) => param is infer U ? U extends string ? U : string : string;
type RouteParams = {  };
type RouteId = '/';
type MaybeWithVoid<T> = {} extends T ? T | void : T;
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K; }[keyof T];
type OutputDataShape<T> = MaybeWithVoid<Omit<App.PageData, RequiredKeys<T>> & Partial<Pick<App.PageData, keyof T & keyof App.PageData>> & Record<string, any>>
type EnsureDefined<T> = T extends null | undefined ? {} : T;
type OptionalUnion<U extends Record<string, any>, A extends keyof U = U extends U ? keyof U : never> = U extends unknown ? { [P in Exclude<A, keyof U>]?: never } & U : never;
export type Snapshot<T = any> = Kit.Snapshot<T>;
type LayoutRouteId = RouteId | "/(app)" | "/(app)/album/modify/[albumId]" | "/(app)/album/release" | "/(app)/album/[albumId]" | "/(app)/credit" | "/(app)/credit/charge" | "/(app)/credit/charge/payment" | "/(app)/credit/charge/payment/fail" | "/(app)/credit/charge/payment/success" | "/(app)/credit/withdraw" | "/(app)/credit/withdraw/admin" | "/(app)/member/join" | "/(app)/member/login" | "/(app)/member/[username]" | "/(app)/member/[username]/albums" | "/(app)/member/[username]/community" | "/(app)/member/[username]/community/modify" | "/(app)/member/[username]/community/write" | "/(app)/member/[username]/donation" | "/(app)/member/[username]/donation/list" | "/(app)/member/[username]/modify" | "/(app)/member/[username]/modify/password" | "/(app)/search" | "/(legal)/imprint" | null
type LayoutParams = RouteParams & { albumId?: string; username?: string }
type LayoutParentData = EnsureDefined<{}>;

export type LayoutServerData = null;
export type LayoutData = Expand<LayoutParentData>;