import api, { unwrapApiResults } from '@/services/api/client'
import { normalizeApiError } from '@/services/api/error'
import type { Supplier } from '@/types/supplier'

export const suppliersService = {
  async list() {
    try {
      const response = await api.get('/supplier')
      return unwrapApiResults<Supplier[]>(response.data) ?? []
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
}
