
export const STORE_TYPES = [
 
] as const;

export type StoreTypes = (typeof STORE_TYPES)[number];

export const LOW_STOCK_STATUSES: StoreTypes[] = [
 
];
