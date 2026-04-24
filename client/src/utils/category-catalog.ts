import { readCategoryCatalog, saveCategoryCatalog } from '@/utils/storage'

function normalizeCategory(value: string) {
  return value.trim()
}

export function getCategoryCatalog() {
  return readCategoryCatalog().map(normalizeCategory).filter(Boolean)
}

export function upsertCategory(category: string) {
  const normalized = normalizeCategory(category)
  const categories = new Set(getCategoryCatalog())

  if (normalized) {
    categories.add(normalized)
  }

  saveCategoryCatalog([...categories].sort((left, right) => left.localeCompare(right)))
}

export function renameCategoryInCatalog(previousName: string, nextName: string) {
  const categories = getCategoryCatalog().filter((item) => item !== previousName)
  const normalized = normalizeCategory(nextName)

  if (normalized) {
    categories.push(normalized)
  }

  saveCategoryCatalog([...new Set(categories)].sort((left, right) => left.localeCompare(right)))
}

export function deleteCategoryFromCatalog(category: string) {
  saveCategoryCatalog(getCategoryCatalog().filter((item) => item !== category))
}
