import { TableCell, TableRow } from '../table'

export function ProductCardSkeleton() {
  return (
    <div className="bg-card border rounded-xl shadow-sm p-4 m-2 animate-pulse">
      {/* Image */}
      <div className="h-20 w-20 bg-gray-300 rounded-md mb-3" />

      {/* Title */}
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />

      {/* Description */}
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />

      {/* Price */}
      <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />

      {/* Tags */}
      <div className="flex gap-2 mt-3">
        <div className="h-5 w-10 bg-gray-300 rounded" />
        <div className="h-5 w-12 bg-gray-300 rounded" />
      </div>
    </div>
  )
}

export const BannerSkeletonRow = () => (
  <TableRow className="animate-pulse">
    <TableCell className="flex gap-4 items-center">
      <div className="w-[100px] h-[100px] bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded mx-auto" />
    </TableCell>
    <TableCell>
      <div className="h-6 w-12 bg-gray-300 dark:bg-gray-700 rounded mx-auto" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-8 bg-gray-300 dark:bg-gray-700 rounded mx-auto" />
    </TableCell>
    <TableCell className="text-right">
      <div className="flex gap-2 justify-end">
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </TableCell>
  </TableRow>
)

export function StatCardSkeleton() {
  return (
    <div className="bg-card border rounded-xl p-4 flex items-center gap-4 shadow-sm animate-pulse">
      <div className="p-3 rounded-lg bg-gray-300 dark:bg-gray-700 w-10 h-10" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-20" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-12" />
      </div>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border animate-pulse">
      <div className="h-5 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-muted/40 text-xs uppercase">
              <th className="p-3">Category</th>
              <th className="p-3">Total</th>
              <th className="p-3">Active</th>
              <th className="p-3">Inactive</th>
              <th className="p-3">Avg Rating</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(4)].map((_, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
                </td>
                <td className="p-3">
                  <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded" />
                </td>
                <td className="p-3">
                  <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded" />
                </td>
                <td className="p-3">
                  <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded" />
                </td>
                <td className="p-3">
                  <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function SalesCardSkeleton() {
  return (
    <div className="bg-card border rounded-xl shadow-sm p-5 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-3 w-48 bg-gray-200 dark:bg-gray-600 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>

      {/* Sale Details */}
      <div className="flex justify-between items-center text-sm mb-4">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-3 w-40 bg-gray-200 dark:bg-gray-600 rounded" />
        </div>
        <div className="h-6 w-12 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>

      {/* Products List */}
      <div className="space-y-2">
        {[...Array(2)].map((_, idx) => (
          <div
            key={idx}
            className="flex gap-3 bg-gray-200 dark:bg-gray-700/40 p-2 rounded-lg items-center"
          >
            <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const OrderSkeletonRow = () => (
  <TableRow className="animate-pulse">
    <TableCell className="p-3">
      <div className="h-4 w-6 bg-gray-300 dark:bg-gray-700 rounded" />
    </TableCell>
    <TableCell className="p-3">
      <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
    </TableCell>
    <TableCell className="p-3">
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </TableCell>
    <TableCell className="p-3">
      <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
    </TableCell>
    <TableCell className="p-3">
      <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
    </TableCell>
    <TableCell className="p-3">
      <div className="flex gap-2">
        <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </TableCell>
  </TableRow>
)
