import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DataTable, type TableColumn } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { StoreForm } from '@/forms/store-form'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useToast } from '@/hooks/use-toast'
import { storesService } from '@/services/stores.service'
import type { Store } from '@/types/store'
import { formatDateTime } from '@/utils/format'
import { paginateItems } from '@/utils/pagination'

export function StoresPage() {
  const toast = useToast()
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<Store | undefined>()
  const [backendIssue, setBackendIssue] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search)

  async function loadStores() {
    setLoading(true)

    try {
      const nextStores = await storesService.list()
      setStores(nextStores)
      setBackendIssue(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load stores.'
      setBackendIssue(message)
      setStores([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadStores()
  }, [])

  const filteredStores = useMemo(
    () =>
      stores.filter((store) =>
        [store.store_name, store.location, store.store_type]
          .join(' ')
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()),
      ),
    [debouncedSearch, stores],
  )

  const paginated = paginateItems(filteredStores, currentPage, 8)

  const columns: TableColumn<Store>[] = [
    {
      key: 'store',
      header: 'Store',
      cell: (store) => (
        <div className="flex items-center gap-3">
          {store.image ? (
            <img
              src={store.image}
              alt={store.store_name}
              className="h-12 w-12 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-xs font-bold uppercase dark:bg-white/10">
              {store.store_name.slice(0, 2)}
            </div>
          )}
          <div>
            <p className="font-semibold">{store.store_name}</p>
            <p className="text-sm text-stone-600 dark:text-stone-300">{store.location}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: (store) => <span>{store.store_type || 'Not specified'}</span>,
    },
    {
      key: 'updated',
      header: 'Updated',
      cell: (store) => <span>{formatDateTime(store.updatedAt)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (store) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedStore(store)
              setModalOpen(true)
            }}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              const storeId = store.id ?? store._id
              if (!storeId || !window.confirm(`Delete "${store.store_name}"?`)) {
                return
              }
              try {
                await storesService.remove(storeId)
                setStores((current) =>
                  current.filter((item) => (item.id ?? item._id) !== storeId),
                )
                toast.success('Store deleted')
              } catch (error) {
                toast.error('Unable to delete store', error instanceof Error ? error.message : undefined)
              }
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  async function handleStoreSubmit(values: Record<string, unknown>) {
    setSaving(true)

    try {
      const payload = {
        store_name: String(values.store_name ?? ''),
        location: String(values.location ?? ''),
        store_type: String(values.store_type ?? '').trim() || undefined,
        image_file: (values.image_file as File | null | undefined) ?? undefined,
      }

      if (selectedStore?.id || selectedStore?._id) {
        await storesService.update(selectedStore.id ?? selectedStore._id ?? '', payload)
        toast.success('Store updated')
      } else {
        await storesService.create(payload)
        toast.success('Store created')
      }

      setModalOpen(false)
      setSelectedStore(undefined)
      await loadStores()
    } catch (error) {
      toast.error('Unable to save store', error instanceof Error ? error.message : undefined)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <Input
            label="Search stores"
            placeholder="Search by store name or location"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="lg:max-w-sm"
          />
          <Button
            onClick={() => {
              setSelectedStore(undefined)
              setModalOpen(true)
            }}
          >
            Add Store
          </Button>
        </div>
        {backendIssue ? (
          <p className="text-sm text-amber-700 dark:text-amber-200">
            The backend store controller is not fully implemented yet: {backendIssue}
          </p>
        ) : null}
      </Card>

      {backendIssue && !stores.length ? (
        <EmptyState
          title="Store routes are not available yet"
          description="The Nest store service exists, but the controller layer in the backend is still incomplete."
          action={
            <Button variant="secondary" onClick={() => void loadStores()}>
              Retry
            </Button>
          }
        />
      ) : (
        <>
          <DataTable
            data={paginated.items}
            columns={columns}
            rowKey={(store) => store.id ?? store._id ?? store.store_name}
            loading={loading}
            emptyTitle="No stores found"
            emptyDescription="Create a store to tie inventory records to a real location."
          />
          <div className="flex items-center justify-between text-sm text-stone-600 dark:text-stone-300">
            <p>
              Showing {paginated.items.length} of {paginated.totalItems} stores
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
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedStore(undefined)
        }}
        title={selectedStore ? 'Edit Store' : 'Create Store'}
        description="Store fields follow the backend store DTOs that already exist in the Nest service layer."
      >
        <StoreForm
          initialValues={selectedStore}
          isLoading={saving}
          onSubmit={(values) => void handleStoreSubmit(values)}
        />
      </Modal>
    </div>
  )
}
