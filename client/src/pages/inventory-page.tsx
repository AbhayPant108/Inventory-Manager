import { useEffect, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DataTable, type TableColumn } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Select } from '@/components/ui/select'
import { InventoryForm } from '@/forms/inventory-form'
import { StockActionForm } from '@/forms/stock-action-form'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useToast } from '@/hooks/use-toast'
import { inventoryService } from '@/services/inventory.service'
import { productsService } from '@/services/products.service'
import { storesService } from '@/services/stores.service'
import type { InventoryItem, InventoryStatus } from '@/types/inventory'
import type { Product } from '@/types/product'
import type { Store } from '@/types/store'
import { formatDateTime, humanizeInventoryStatus, shortObjectId } from '@/utils/format'
import { paginateItems } from '@/utils/pagination'

type StockActionType = 'restock' | 'reserve' | 'release' | 'consume' | 'adjust'

export function InventoryPage() {
  const toast = useToast()
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    product_id: '',
    lowStockOnly: false,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [recordModalOpen, setRecordModalOpen] = useState(false)
  const [selectedInventory, setSelectedInventory] = useState<InventoryItem | undefined>()
  const [stockModalOpen, setStockModalOpen] = useState(false)
  const [stockAction, setStockAction] = useState<StockActionType>('restock')
  const [stockTarget, setStockTarget] = useState<InventoryItem | undefined>()
  const [backendIssue, setBackendIssue] = useState<string | null>(null)
  const debouncedSearch = useDebouncedValue(filters.search)

  async function loadInventoryPage() {
    setLoading(true)
    const [inventoryResult, productsResult, storesResult] = await Promise.allSettled([
      inventoryService.list(),
      productsService.list(),
      storesService.list(),
    ])

    if (inventoryResult.status === 'fulfilled') {
      setInventoryItems(inventoryResult.value)
      setBackendIssue(null)
    } else {
      setInventoryItems([])
      setBackendIssue(inventoryResult.reason.message)
    }

    if (productsResult.status === 'fulfilled') {
      setProducts(productsResult.value)
    }

    if (storesResult.status === 'fulfilled') {
      setStores(storesResult.value)
    }

    setLoading(false)
  }

  useEffect(() => {
    void loadInventoryPage()
  }, [])

  const filteredInventory = useMemo(() => {
    return inventoryItems.filter((item) => {
      const productName =
        products.find((product) => (product.id ?? product._id) === item.product_id)?.product_name ?? ''
      const storeName =
        stores.find((store) => (store.id ?? store._id) === item.store_id)?.store_name ?? ''

      const matchesSearch = debouncedSearch
        ? [item.location_in_store, productName, storeName, item.supplier_id]
            .join(' ')
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase())
        : true
      const matchesStatus = filters.status ? item.status === filters.status : true
      const matchesProduct = filters.product_id ? item.product_id === filters.product_id : true
      const matchesLowStock = filters.lowStockOnly ? item.status !== 'IN_STOCK' : true

      return matchesSearch && matchesStatus && matchesProduct && matchesLowStock
    })
  }, [debouncedSearch, filters.lowStockOnly, filters.product_id, filters.status, inventoryItems, products, stores])

  const paginated = paginateItems(filteredInventory, currentPage, 8)

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, filters.lowStockOnly, filters.product_id, filters.status])

  function replaceInventoryItem(nextItem: InventoryItem) {
    setInventoryItems((current) =>
      current.map((item) => (item.id === nextItem.id ? nextItem : item)),
    )
  }

  async function handleInventorySubmit(values: Record<string, unknown>) {
    setSaving(true)

    try {
      const payload = {
        store_id: String(values.store_id ?? ''),
        supplier_id: String(values.supplier_id ?? ''),
        product_id: String(values.product_id ?? ''),
        quantity: Number(values.quantity ?? 0),
        reserved_quantity: Number(values.reserved_quantity ?? 0),
        low_stock_threshold: Number(values.low_stock_threshold ?? 0),
        location_in_store: String(values.location_in_store ?? ''),
      }

      if (selectedInventory) {
        const updated = await inventoryService.update(selectedInventory.id, payload)
        replaceInventoryItem(updated)
        toast.success('Inventory updated')
      } else {
        const created = await inventoryService.create(payload)
        setInventoryItems((current) => [created, ...current])
        toast.success('Inventory created')
      }

      setRecordModalOpen(false)
      setSelectedInventory(undefined)
    } catch (error) {
      toast.error('Unable to save inventory', error instanceof Error ? error.message : undefined)
    } finally {
      setSaving(false)
    }
  }

  async function handleStockAction(values: Record<string, unknown>) {
    if (!stockTarget) {
      return
    }

    setSaving(true)

    try {
      let updated: InventoryItem
      const quantityPayload = {
        quantity: Number(values.quantity ?? 0),
      }
      const adjustPayload = {
        quantity_change: Number(values.quantity_change ?? 0),
      }
      switch (stockAction) {
        case 'adjust':
          updated = await inventoryService.adjustStock(stockTarget.id, adjustPayload)
          break
        case 'restock':
          updated = await inventoryService.restock(stockTarget.id, quantityPayload)
          break
        case 'reserve':
          updated = await inventoryService.reserve(stockTarget.id, quantityPayload)
          break
        case 'release':
          updated = await inventoryService.release(stockTarget.id, quantityPayload)
          break
        default:
          updated = await inventoryService.consumeReserved(stockTarget.id, quantityPayload)
          break
      }

      replaceInventoryItem(updated)
      toast.success('Inventory action completed')
      setStockModalOpen(false)
      setStockTarget(undefined)
    } catch (error) {
      toast.error('Unable to update stock', error instanceof Error ? error.message : undefined)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(record: InventoryItem) {
    if (!window.confirm(`Delete inventory record at "${record.location_in_store}"?`)) {
      return
    }

    try {
      await inventoryService.remove(record.id)
      setInventoryItems((current) => current.filter((item) => item.id !== record.id))
      toast.success('Inventory deleted')
    } catch (error) {
      toast.error('Unable to delete inventory', error instanceof Error ? error.message : undefined)
    }
  }

  const columns: TableColumn<InventoryItem>[] = [
    {
      key: 'product',
      header: 'Product',
      cell: (item) => {
        const product = products.find((entry) => (entry.id ?? entry._id) === item.product_id)
        const store = stores.find((entry) => (entry.id ?? entry._id) === item.store_id)
        return (
          <div className="space-y-1">
            <p className="font-semibold">{product?.product_name ?? shortObjectId(item.product_id)}</p>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              {store?.store_name ?? shortObjectId(item.store_id)} · {item.location_in_store}
            </p>
          </div>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      cell: (item) => (
        <Badge
          variant={
            item.status === 'IN_STOCK'
              ? 'success'
              : item.status === 'LOW_STOCK'
                ? 'warning'
                : 'danger'
          }
        >
          {humanizeInventoryStatus(item.status)}
        </Badge>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantities',
      cell: (item) => (
        <div className="space-y-1 text-sm">
          <p>Total: {item.quantity}</p>
          <p>Reserved: {item.reserved_quantity}</p>
          <p>Available: {item.available_quantity}</p>
        </div>
      ),
    },
    {
      key: 'supplier',
      header: 'Supplier ID',
      cell: (item) => <span>{shortObjectId(item.supplier_id)}</span>,
    },
    {
      key: 'updated',
      header: 'Updated',
      cell: (item) => <span>{formatDateTime(item.updatedAt)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (item) => (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedInventory(item)
              setRecordModalOpen(true)
            }}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setStockTarget(item)
              setStockAction('restock')
              setStockModalOpen(true)
            }}
          >
            Stock Action
          </Button>
          <Button variant="danger" onClick={() => void handleDelete(item)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  const inventoryStatusOptions = ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'] satisfies InventoryStatus[]

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
          <Input
            label="Search inventory"
            placeholder="Search by product, store, location, or supplier id"
            value={filters.search}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
          />
          <Select
            label="Status"
            value={filters.status}
            onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
            placeholder="All statuses"
            options={inventoryStatusOptions.map((status) => ({
              label: humanizeInventoryStatus(status),
              value: status,
            }))}
          />
          <Select
            label="Product"
            value={filters.product_id}
            onChange={(event) => setFilters((current) => ({ ...current, product_id: event.target.value }))}
            placeholder="All products"
            options={products.map((product) => ({
              label: product.product_name,
              value: product.id ?? product._id ?? '',
            }))}
          />
          <div className="flex flex-col justify-end gap-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={filters.lowStockOnly}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, lowStockOnly: event.target.checked }))
                }
              />
              Low stock only
            </label>
            <Button
              onClick={() => {
                setSelectedInventory(undefined)
                setRecordModalOpen(true)
              }}
            >
              Add Inventory
            </Button>
          </div>
        </div>
        {backendIssue ? (
          <p className="text-sm text-amber-700 dark:text-amber-200">
            Inventory endpoints appear incomplete for the current backend session: {backendIssue}
          </p>
        ) : null}
      </Card>

      {backendIssue && !inventoryItems.length ? (
        <EmptyState
          title="Inventory API unavailable"
          description="The frontend is wired for the inventory module, but the current backend auth and request-user plumbing still need finishing."
          action={
            <Button variant="secondary" onClick={() => void loadInventoryPage()}>
              Retry
            </Button>
          }
        />
      ) : (
        <>
          <DataTable
            data={paginated.items}
            columns={columns}
            rowKey={(item) => item.id}
            loading={loading}
            emptyTitle="No inventory records found"
            emptyDescription="Create a record once you have product, store, and supplier IDs available."
          />
          <div className="flex items-center justify-between text-sm text-stone-600 dark:text-stone-300">
            <p>
              Showing {paginated.items.length} of {paginated.totalItems} records
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
        </>
      )}

      <Modal
        open={recordModalOpen}
        onClose={() => {
          setRecordModalOpen(false)
          setSelectedInventory(undefined)
        }}
        title={selectedInventory ? 'Edit Inventory Record' : 'Create Inventory Record'}
        description="Inventory payloads follow the backend inventory DTO and status rules."
      >
        <InventoryForm
          products={products}
          stores={stores}
          initialValues={selectedInventory}
          isLoading={saving}
          onSubmit={(values) => void handleInventorySubmit(values)}
        />
      </Modal>

      <Modal
        open={stockModalOpen}
        onClose={() => {
          setStockModalOpen(false)
          setStockTarget(undefined)
        }}
        title="Inventory Stock Action"
        description="Use the dropdown first, then apply a quantity change using the matching backend action endpoint."
      >
        <div className="mb-4">
          <Select
            label="Action"
            value={stockAction}
            onChange={(event) => setStockAction(event.target.value as StockActionType)}
            options={[
              { label: 'Restock', value: 'restock' },
              { label: 'Reserve', value: 'reserve' },
              { label: 'Release Reserved', value: 'release' },
              { label: 'Consume Reserved', value: 'consume' },
              { label: 'Adjust Stock', value: 'adjust' },
            ]}
          />
        </div>
        <StockActionForm
          action={stockAction}
          isLoading={saving}
          onSubmit={(values) => void handleStockAction(values)}
        />
      </Modal>
    </div>
  )
}
