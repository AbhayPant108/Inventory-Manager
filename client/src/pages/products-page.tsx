import { useEffect, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DataTable, type TableColumn } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Select } from '@/components/ui/select'
import { ProductForm } from '@/forms/product-form'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useToast } from '@/hooks/use-toast'
import { productsService } from '@/services/products.service'
import type { Product, ProductPayload } from '@/types/product'
import { formatCurrency, formatDateTime } from '@/utils/format'
import { paginateItems } from '@/utils/pagination'
import { getCategoryCatalog, upsertCategory } from '@/utils/category-catalog'

export function ProductsPage() {
  const toast = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()

  const debouncedSearch = useDebouncedValue(search, 250)

  async function loadProducts() {
    setLoading(true)

    try {
      const nextProducts = await productsService.list()
      setProducts(nextProducts)
    } catch (error) {
      toast.error('Unable to load products', error instanceof Error ? error.message : undefined)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  const categories = useMemo(() => {
    const catalog = getCategoryCatalog()
    const usedCategories = products.map((product) => product.category.trim()).filter(Boolean)
    return [...new Set([...catalog, ...usedCategories])].sort((left, right) =>
      left.localeCompare(right),
    )
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = debouncedSearch
        ? [product.product_name, product.description, product.category]
            .join(' ')
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase())
        : true

      const matchesCategory = categoryFilter ? product.category === categoryFilter : true

      return matchesSearch && matchesCategory
    })
  }, [categoryFilter, debouncedSearch, products])

  const paginated = paginateItems(filteredProducts, currentPage, 8)

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, categoryFilter])

  async function handleProductSubmit(values: Record<string, unknown>) {
    setSaving(true)

    try {
      const payload: ProductPayload = {
        product_name: String(values.product_name ?? ''),
        description: String(values.description ?? ''),
        price: Number(values.price ?? 0),
        category: String(values.category ?? '').trim(),
        product_image: (values.product_image as File | null | undefined) ?? undefined,
      }

      upsertCategory(payload.category)

      if (selectedProduct?.id || selectedProduct?._id) {
        const updated = await productsService.update(selectedProduct.id ?? selectedProduct._id ?? '', payload)
        setProducts((current) =>
          current.map((product) =>
            (product.id ?? product._id) === (selectedProduct.id ?? selectedProduct._id)
              ? { ...product, ...updated, category: payload.category }
              : product,
          ),
        )
        toast.success('Product updated')
      } else {
        await productsService.create(payload)
        toast.success('Product created')
        await loadProducts()
      }

      setModalOpen(false)
      setSelectedProduct(undefined)
    } catch (error) {
      toast.error('Unable to save product', error instanceof Error ? error.message : undefined)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(product: Product) {
    const productId = product.id ?? product._id
    if (!productId) {
      return
    }

    const confirmed = window.confirm(`Delete "${product.product_name}"?`)
    if (!confirmed) {
      return
    }

    try {
      await productsService.remove(productId)
      setProducts((current) =>
        current.filter((item) => (item.id ?? item._id) !== productId),
      )
      toast.success('Product deleted')
    } catch (error) {
      toast.error('Unable to delete product', error instanceof Error ? error.message : undefined)
    }
  }

  const columns: TableColumn<Product>[] = [
    {
      key: 'product',
      header: 'Product',
      cell: (product) => (
        <div className="flex items-center gap-3">
          {product.image ? (
            <img
              src={product.image}
              alt={product.product_name}
              className="h-12 w-12 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-xs font-bold uppercase dark:bg-white/10">
              {product.product_name.slice(0, 2)}
            </div>
          )}
          <div>
            <p className="font-semibold">{product.product_name}</p>
            <p className="max-w-md text-sm text-stone-600 dark:text-stone-300">
              {product.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      cell: (product) => <Badge>{product.category}</Badge>,
    },
    {
      key: 'price',
      header: 'Price',
      cell: (product) => <span className="font-semibold">{formatCurrency(product.price)}</span>,
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      cell: (product) => <span>{formatDateTime(product.updatedAt)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (product) => (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedProduct(product)
              setModalOpen(true)
            }}
          >
            Edit
          </Button>
          <Button variant="danger" onClick={() => void handleDelete(product)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid gap-3 md:grid-cols-2 lg:w-2/3">
            <Input
              label="Search products"
              placeholder="Search by name, description, or category"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Select
              label="Filter by category"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              placeholder="All categories"
              options={categories.map((category) => ({
                label: category,
                value: category,
              }))}
            />
          </div>
          <Button
            onClick={() => {
              setSelectedProduct(undefined)
              setModalOpen(true)
            }}
          >
            Add Product
          </Button>
        </div>
      </Card>

      <DataTable
        data={paginated.items}
        columns={columns}
        loading={loading}
        rowKey={(product) => product.id ?? product._id ?? product.product_name}
        emptyTitle="No products found"
        emptyDescription="Create a product to start building the catalog."
      />

      <div className="flex items-center justify-between text-sm text-stone-600 dark:text-stone-300">
        <p>
          Showing {paginated.items.length} of {paginated.totalItems} products
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            disabled={paginated.currentPage <= 1}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            Previous
          </Button>
          <span>
            Page {paginated.currentPage} of {paginated.totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={paginated.currentPage >= paginated.totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedProduct(undefined)
        }}
        title={selectedProduct ? 'Edit Product' : 'Create Product'}
        description="Product creation follows the backend product DTO and image upload conventions."
      >
        <ProductForm
          categories={categories}
          initialValues={selectedProduct}
          isLoading={saving}
          onSubmit={(values) => void handleProductSubmit(values)}
        />
      </Modal>
    </div>
  )
}
