import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DataTable, type TableColumn } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { suppliersService } from '@/services/suppliers.service'
import type { Supplier } from '@/types/supplier'

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [backendIssue, setBackendIssue] = useState<string | null>(null)

  async function loadSuppliers() {
    setLoading(true)

    try {
      const nextSuppliers = await suppliersService.list()
      setSuppliers(nextSuppliers)
      setBackendIssue(null)
    } catch (error) {
      setSuppliers([])
      setBackendIssue(error instanceof Error ? error.message : 'Unable to load suppliers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSuppliers()
  }, [])

  const columns = useMemo<TableColumn<Supplier>[]>(() => {
    if (!suppliers.length) {
      return []
    }

    return [
      {
        key: 'name',
        header: 'Supplier',
        cell: (supplier) => <span>{String(supplier.supplier_name ?? supplier.name ?? 'Unknown')}</span>,
      },
      {
        key: 'email',
        header: 'Email',
        cell: (supplier) => <span>{String(supplier.email ?? 'N/A')}</span>,
      },
      {
        key: 'phone',
        header: 'Phone',
        cell: (supplier) => <span>{String(supplier.phone ?? 'N/A')}</span>,
      },
      {
        key: 'address',
        header: 'Address',
        cell: (supplier) => <span>{String(supplier.address ?? 'N/A')}</span>,
      },
    ]
  }, [suppliers])

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <h2 className="font-display text-2xl font-semibold">Supplier Backend Status</h2>
        {backendIssue ? (
          <p className="text-sm text-amber-700 dark:text-amber-200">{backendIssue}</p>
        ) : 'Working'}
      </Card>

      {backendIssue && !suppliers.length ? (
        <EmptyState
          title="Supplier CRUD is waiting on the backend"
          description="This page is intentionally in place so the frontend structure is complete, but the Nest supplier module still needs actual endpoints and models."
          action={
            <Button variant="secondary" onClick={() => void loadSuppliers()}>
              Retry
            </Button>
          }
        />
      ) : (
        <DataTable
          data={suppliers}
          columns={columns}
          rowKey={(supplier) => String(supplier.id ?? supplier._id ?? supplier.supplier_name ?? supplier.name)}
          loading={loading}
          emptyTitle="No suppliers found"
          emptyDescription="Suppliers will appear here once the backend module starts returning data."
        />
      )}
    </div>
  )
}
