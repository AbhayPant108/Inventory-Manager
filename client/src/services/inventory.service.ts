import api, { unwrapApiResults } from '@/services/api/client'
import { normalizeApiError } from '@/services/api/error'
import type {
  AdjustStockPayload,
  InventoryFilters,
  InventoryItem,
  InventoryPayload,
  StockQuantityPayload,
} from '@/types/inventory'

export const inventoryService = {
  async list(filters: InventoryFilters = {}) {
    try {
      const response = await api.get('/inventory', {
        params: filters,
      })

      return unwrapApiResults<InventoryItem[]>(response.data) ?? []
    } catch (error) {
      throw normalizeApiError(error)
    }
  },

  async listLowStock(filters: InventoryFilters = {}) {
    try {
      const response = await api.get('/inventory/low-stock', {
        params: filters,
      })

      return unwrapApiResults<InventoryItem[]>(response.data) ?? []
    } catch (error) {
      throw normalizeApiError(error)
    }
  },

  async create(payload: InventoryPayload) {
    try {
      const response = await api.post('/inventory', payload)
      return unwrapApiResults<InventoryItem>(response.data)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },

  async update(id: string, payload: Partial<InventoryPayload>) {
    try {
      const response = await api.patch(`/inventory/${id}`, payload)
      return unwrapApiResults<InventoryItem>(response.data)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },

  async adjustStock(id: string, payload: AdjustStockPayload) {
    try {
      const response = await api.patch(`/inventory/${id}/adjust-stock`, payload)
      return unwrapApiResults<InventoryItem>(response.data)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },

  async restock(id: string, payload: StockQuantityPayload) {
    try {
      const response = await api.patch(`/inventory/${id}/restock`, payload)
      return unwrapApiResults<InventoryItem>(response.data)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },

  async reserve(id: string, payload: StockQuantityPayload) {
    try {
      const response = await api.patch(`/inventory/${id}/reserve`, payload)
      return unwrapApiResults<InventoryItem>(response.data)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },

  async release(id: string, payload: StockQuantityPayload) {
    try {
      const response = await api.patch(`/inventory/${id}/release`, payload)
      return unwrapApiResults<InventoryItem>(response.data)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },

  async consumeReserved(id: string, payload: StockQuantityPayload) {
    try {
      const response = await api.patch(`/inventory/${id}/consume-reserved`, payload)
      return unwrapApiResults<InventoryItem>(response.data)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },

  async remove(id: string) {
    try {
      await api.delete(`/inventory/${id}`)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
}
