export interface Store {
  id?: string
  _id?: string
  store_name: string
  location: string
  owner_id?: string
  store_type?: string
  image?: string
  createdAt?: string
  updatedAt?: string
}

export interface StorePayload {
  store_name: string
  location: string
  store_type?: string
  image_file?: File | null
}

export interface StoreFilters {
  store_name?: string
  location?: string
  store_type?: string
}
