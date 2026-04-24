import api, { unwrapApiResults } from '@/services/api/client'
import { normalizeApiError } from '@/services/api/error'
import type { Product, ProductPayload } from '@/types/product'

function buildProductFormData(payload: ProductPayload) {
  const formData = new FormData()

  formData.append('product_name', payload.product_name)
  formData.append('description', payload.description)
  formData.append('price', String(payload.price))
  formData.append('category', payload.category)

  if (payload.product_image) {
    formData.append('product_image', payload.product_image)
  }

  return formData
}

export const productsService = {
  async list() {
    try {
      const response = await api.get('/product')
      return unwrapApiResults<Product[]>(response.data) ?? []
    } catch (error) {
      throw normalizeApiError(error)
    }
  },

  async create(payload: ProductPayload) {
    try {
      const response = await api.post('/product', buildProductFormData(payload))
      return response.data
    } catch (error) {
      throw normalizeApiError(error)
    }
  },

  async update(id: string, payload: ProductPayload) {
    try {
      const hasFile = payload.product_image instanceof File

      const response = hasFile
        ? await api.patch(`/product/${id}`, buildProductFormData(payload))
        : await api.patch(`/product/${id}`, {
            product_name: payload.product_name,
            description: payload.description,
            price: payload.price,
            category: payload.category,
          })

      return unwrapApiResults<Product>(response.data)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },

  async remove(id: string) {
    try {
      await api.delete(`/product/${id}`)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
}
