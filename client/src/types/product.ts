export interface Product {
  id?: string
  _id?: string
  product_name: string
  description: string
  image?: string
  price: number
  category: string
  createdAt?: string
  updatedAt?: string
}

export interface ProductFilters {
  product_name?: string
  category?: string
  price?: number
}

export interface ProductPayload {
  product_name: string
  description: string
  price: number
  category: string
  product_image?: File | null
}
