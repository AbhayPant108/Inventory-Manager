import api, { unwrapApiResults } from '@/services/api/client'
import { normalizeApiError } from '@/services/api/error'
import type { Store, StoreFilters, StorePayload } from '@/types/store'

function buildStoreFormData(payload: StorePayload) {
  const formData = new FormData()

  formData.append('store_name', payload.store_name)
  formData.append('location', payload.location)

  if (payload.store_type) {
    formData.append('store_type', payload.store_type)
  }

  if (payload.image_file) {
    formData.append('image', payload.image_file)
  }

  return formData
}

export const storesService = {
  async list(filters: StoreFilters = {}) {
    try {
      const response = await api.get('/store', {
        params: filters,
      })

      return unwrapApiResults<Store[]>(response.data) ?? []
    } catch (error) {
      throw normalizeApiError(error)
    }
  },

  async create(payload: StorePayload) {
    try {
      const response = await api.post('/store', buildStoreFormData(payload))
      return unwrapApiResults<Store>(response.data)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },

  async update(id: string, payload: StorePayload) {
    try {
      const response = await api.patch(`/store/${id}`, buildStoreFormData(payload))
      return unwrapApiResults<Store>(response.data)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },

  async remove(id: string) {
    try {
      await api.delete(`/store/${id}`)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
}
