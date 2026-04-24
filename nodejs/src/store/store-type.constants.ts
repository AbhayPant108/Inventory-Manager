
export const STORE_TYPES = [
 'Food','Electronics'
] as const;

export type StoreTypes = (typeof STORE_TYPES)[number];

export const LOW_STOCK_STATUSES: StoreTypes[] = [
 
];
