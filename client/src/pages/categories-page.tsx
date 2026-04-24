import { useEffect, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useToast } from '@/hooks/use-toast'
import { productsService } from '@/services/products.service'
import type { Product } from '@/types/product'
import { formatCurrency } from '@/utils/format'
import {
  deleteCategoryFromCatalog,
  getCategoryCatalog,
  renameCategoryInCatalog,
  upsertCategory,
} from '@/utils/category-catalog'

interface CategorySummary {
  name: string
  productCount: number
  averagePrice: number
}

export function CategoriesPage() {
  const toast = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [renameModalOpen, setRenameModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [draftCategory, setDraftCategory] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [replacementCategory, setReplacementCategory] = useState('')
  const debouncedSearch = useDebouncedValue(search, 250)

  async function loadProducts() {
    setLoading(true)

    try {
      const nextProducts = await productsService.list()
      setProducts(nextProducts)
    } catch (error) {
      toast.error('Unable to load categories', error instanceof Error ? error.message : undefined)
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
    const allCategories = [...new Set([...catalog, ...usedCategories])]

    return allCategories
      .map((name) => {
        const matches = products.filter((product) => product.category === name)
        return {
          name,
          productCount: matches.length,
          averagePrice: matches.length
            ? matches.reduce((sum, product) => sum + product.price, 0) / matches.length
            : 0,
        } satisfies CategorySummary
      })
      .filter((item) =>
        debouncedSearch
          ? item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
          : true,
      )
      .sort((left, right) => left.name.localeCompare(right.name))
  }, [debouncedSearch, products])

  async function renameCategory() {
    if (!selectedCategory || !renameValue.trim()) {
      return
    }

    const nextValue = renameValue.trim()

    try {
      const affectedProducts = products.filter((product) => product.category === selectedCategory)
      await Promise.all(
        affectedProducts.map((product) =>
          productsService.update(product.id ?? product._id ?? '', {
            product_name: product.product_name,
            description: product.description,
            price: product.price,
            category: nextValue,
          }),
        ),
      )
      renameCategoryInCatalog(selectedCategory, nextValue)
      setProducts((current) =>
        current.map((product) =>
          product.category === selectedCategory ? { ...product, category: nextValue } : product,
        ),
      )
      toast.success('Category renamed')
      setRenameModalOpen(false)
    } catch (error) {
      toast.error('Unable to rename category', error instanceof Error ? error.message : undefined)
    }
  }

  async function deleteCategory() {
    if (!selectedCategory) {
      return
    }

    try {
      const affectedProducts = products.filter((product) => product.category === selectedCategory)

      if (affectedProducts.length && !replacementCategory.trim()) {
        toast.error('Replacement category required', 'Choose where affected products should move.')
        return
      }

      if (affectedProducts.length) {
        const replacement = replacementCategory.trim()
        await Promise.all(
          affectedProducts.map((product) =>
            productsService.update(product.id ?? product._id ?? '', {
              product_name: product.product_name,
              description: product.description,
              price: product.price,
              category: replacement,
            }),
          ),
        )

        upsertCategory(replacement)
        setProducts((current) =>
          current.map((product) =>
            product.category === selectedCategory
              ? { ...product, category: replacement }
              : product,
          ),
        )
      }

      deleteCategoryFromCatalog(selectedCategory)
      toast.success('Category removed')
      setDeleteModalOpen(false)
    } catch (error) {
      toast.error('Unable to remove category', error instanceof Error ? error.message : undefined)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <Input
            label="Search categories"
            placeholder="Find a category"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="lg:max-w-sm"
          />
          <Button onClick={() => setCreateModalOpen(true)}>Add Category Label</Button>
        </div>
        <p className="text-sm text-stone-600 dark:text-stone-300">
          The backend does not have a standalone categories module, so categories are managed as product label strings plus a frontend catalog of saved suggestions.
        </p>
      </Card>

      {loading ? (
        <Card>Loading categories...</Card>
      ) : categories.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.name} className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-semibold">{category.name}</h2>
                  <p className="text-sm text-stone-600 dark:text-stone-300">
                    {category.productCount} linked products
                  </p>
                </div>
                <Badge>{category.productCount ? 'Used' : 'Saved'}</Badge>
              </div>
              <div className="rounded-2xl bg-stone-100 px-4 py-3 text-sm dark:bg-white/5">
                Average price: {formatCurrency(category.averagePrice || 0)}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedCategory(category.name)
                    setRenameValue(category.name)
                    setRenameModalOpen(true)
                  }}
                >
                  Rename
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setSelectedCategory(category.name)
                    setReplacementCategory('')
                    setDeleteModalOpen(true)
                  }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No categories yet"
          description="Create a product or save a category label to start building your taxonomy."
        />
      )}

      <Modal
        open={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false)
          setDraftCategory('')
        }}
        title="Add Category Label"
        description="Because categories are stored as strings on products, this adds a reusable label to the frontend catalog."
      >
        <div className="space-y-4">
          <Input
            label="Category name"
            value={draftCategory}
            onChange={(event) => setDraftCategory(event.target.value)}
          />
          <Button
            className="w-full"
            onClick={() => {
              if (!draftCategory.trim()) {
                toast.error('Category name required')
                return
              }
              upsertCategory(draftCategory)
              setDraftCategory('')
              setCreateModalOpen(false)
              toast.success('Category label saved')
            }}
          >
            Save Category
          </Button>
        </div>
      </Modal>

      <Modal
        open={renameModalOpen}
        onClose={() => setRenameModalOpen(false)}
        title="Rename Category"
        description="This updates the saved catalog and all products currently using the category."
      >
        <div className="space-y-4">
          <Input
            label="New category name"
            value={renameValue}
            onChange={(event) => setRenameValue(event.target.value)}
          />
          <Button className="w-full" onClick={() => void renameCategory()}>
            Rename Category
          </Button>
        </div>
      </Modal>

      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Category"
        description="If products still use this category, choose a replacement label for those records."
      >
        <div className="space-y-4">
          <Input
            label="Replacement category"
            placeholder="Required when products are linked"
            value={replacementCategory}
            onChange={(event) => setReplacementCategory(event.target.value)}
          />
          <Button className="w-full" variant="danger" onClick={() => void deleteCategory()}>
            Delete Category
          </Button>
        </div>
      </Modal>
    </div>
  )
}
