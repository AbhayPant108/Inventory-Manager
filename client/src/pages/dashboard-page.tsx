import { useEffect, useState } from 'react'
import { MiniBarChart } from '@/components/dashboard/mini-bar-chart'
import { SummaryCard } from '@/components/dashboard/summary-card'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { inventoryService } from '@/services/inventory.service'
import { productsService } from '@/services/products.service'
import { storesService } from '@/services/stores.service'
import type { InventoryItem } from '@/types/inventory'
import type { Product } from '@/types/product'
import type { Store } from '@/types/store'
import { formatCompactNumber, formatDateTime } from '@/utils/format'

export function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [warnings, setWarnings] = useState<string[]>([])

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true)
      const nextWarnings: string[] = []
      const [productsResult, inventoryResult, storesResult] = await Promise.allSettled([
        productsService.list(),
        inventoryService.list(),
        storesService.list(),
      ])

      if (productsResult.status === 'fulfilled') {
        setProducts(productsResult.value)
      } else {
        nextWarnings.push(productsResult.reason.message)
      }

      if (inventoryResult.status === 'fulfilled') {
        setInventoryItems(inventoryResult.value)
      } else {
        nextWarnings.push(`Inventory API: ${inventoryResult.reason.message}`)
      }

      if (storesResult.status === 'fulfilled') {
        setStores(storesResult.value)
      } else {
        nextWarnings.push(`Store API: ${storesResult.reason.message}`)
      }

      setWarnings(nextWarnings)
      setLoading(false)
    }

    void loadDashboard()
  }, [])

  const lowStockCount = inventoryItems.filter((item) => item.status !== 'IN_STOCK').length
  const categoryCounts = [...new Set(products.map((product) => product.category.trim()).filter(Boolean))]
  const categoryChart = categoryCounts
    .map((category) => ({
      label: category,
      value: products.filter((product) => product.category === category).length,
    }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 5)

  const recentInventory = [...inventoryItems]
    .sort(
      (left, right) =>
        new Date(right.updatedAt ?? 0).getTime() - new Date(left.updatedAt ?? 0).getTime(),
    )
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {warnings.length ? (
        <Card className="space-y-3 border-amber-300 dark:border-amber-400/20">
          <div className="flex items-center gap-3">
            <Badge variant="warning">Backend Gaps</Badge>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              Some dashboard modules are unavailable because the backend still has unfinished routes.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-stone-700 dark:text-stone-200">
            {warnings.map((warning) => (
              <li key={warning}>- {warning}</li>
            ))}
          </ul>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </>
        ) : (
          <>
            <SummaryCard
              eyebrow="Catalog"
              title="Products"
              value={formatCompactNumber(products.length)}
              detail="Total catalog items currently reachable from the product API."
            />
            <SummaryCard
              eyebrow="Taxonomy"
              title="Categories"
              value={formatCompactNumber(categoryCounts.length)}
              detail="Unique category labels currently used across products."
            />
            <SummaryCard
              eyebrow="Operations"
              title="Inventory Records"
              value={formatCompactNumber(inventoryItems.length)}
              detail="Inventory records returned by the inventory module."
            />
            <SummaryCard
              eyebrow="Risk"
              title="Low Stock"
              value={formatCompactNumber(lowStockCount)}
              detail="Items flagged as low stock or out of stock."
            />
          </>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">Category Spread</h2>
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Derived directly from the backend product category strings.
              </p>
            </div>
            <Badge>Top 5</Badge>
          </div>
          {loading ? (
            <Skeleton className="h-56" />
          ) : categoryChart.length ? (
            <MiniBarChart data={categoryChart} />
          ) : (
            <EmptyState
              title="No categories yet"
              description="Create a product first and its category label will appear here."
            />
          )}
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">System Snapshot</h2>
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Quick reality check on what the current backend exposes.
              </p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl bg-stone-100 px-4 py-3 dark:bg-white/5">
              <span>Product API</span>
              <Badge variant="success">Ready</Badge>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-stone-100 px-4 py-3 dark:bg-white/5">
              <span>Registration API</span>
              <Badge variant="success">Ready</Badge>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-stone-100 px-4 py-3 dark:bg-white/5">
              <span>JWT Login Flow</span>
              <Badge variant="warning">Backend Pending</Badge>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-stone-100 px-4 py-3 dark:bg-white/5">
              <span>Store Routes</span>
              <Badge variant={stores.length ? 'success' : 'warning'}>
                {stores.length ? 'Detected' : 'Unclear'}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-stone-100 px-4 py-3 dark:bg-white/5">
              <span>Supplier Routes</span>
              <Badge variant="warning">Backend Pending</Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card className="space-y-4">
        <div>
          <h2 className="font-display text-2xl font-semibold">Recent Inventory Updates</h2>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Latest stock records touched by the backend inventory service.
          </p>
        </div>
        {loading ? (
          <Skeleton className="h-48" />
        ) : recentInventory.length ? (
          <div className="space-y-3">
            {recentInventory.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-white/70 px-4 py-4 md:flex-row md:items-center md:justify-between dark:border-white/10 dark:bg-white/5"
              >
                <div>
                  <p className="font-semibold">Location {item.location_in_store}</p>
                  <p className="text-sm text-stone-600 dark:text-stone-300">
                    Product {item.product_id} · Store {item.store_id}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Badge variant={item.status === 'IN_STOCK' ? 'success' : item.status === 'LOW_STOCK' ? 'warning' : 'danger'}>
                    {item.status}
                  </Badge>
                  <span>Qty {item.quantity}</span>
                  <span>Reserved {item.reserved_quantity}</span>
                  <span>Updated {formatDateTime(item.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No inventory activity"
            description="Inventory records will show up here once the backend inventory flow is working for your session."
          />
        )}
      </Card>
    </div>
  )
}
