export const INVENTORY_STATUSES = [
  'IN_STOCK',
  'LOW_STOCK',
  'OUT_OF_STOCK',
] as const;

export type InventoryStatus = (typeof INVENTORY_STATUSES)[number];

export const LOW_STOCK_STATUSES: InventoryStatus[] = [
  'LOW_STOCK',
  'OUT_OF_STOCK',
];
