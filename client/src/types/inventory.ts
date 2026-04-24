export type InventoryStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'

export interface InventoryItem {
  id: string
  store_id: string
  supplier_id: string
  product_id: string
  quantity: number
  reserved_quantity: number
  low_stock_threshold: number
  status: InventoryStatus
  location_in_store: string
  available_quantity: number
  createdAt?: string
  updatedAt?: string
}

export interface InventoryPayload {
  store_id: string
  supplier_id: string
  product_id: string
  quantity: number
  reserved_quantity: number
  low_stock_threshold: number
  location_in_store: string
  status?: InventoryStatus
}

export interface InventoryFilters {
  store_id?: string
  supplier_id?: string
  product_id?: string
  status?: InventoryStatus
  location_in_store?: string
  low_stock_only?: boolean
}

export interface StockQuantityPayload {
  quantity: number
}

export interface AdjustStockPayload {
  quantity_change: number
}
