'use client'
import {
  FaBoxOpen,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaTags,
  FaPercent,
  FaTruck,
  FaMoneyBillWave,
} from 'react-icons/fa'
import { useProductSaleStats } from '../api/productApi'
import { useGetSalesStats } from '../api/saleApi'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import {
  StatCardSkeleton,
  TableSkeleton,
} from '@/components/ui/common/Skeleton'
import { useGetOrderStats } from '../api/orderApi'

function StatCard({ icon: Icon, title, value, color }) {
  return (
    <div className="bg-card border rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition">
      <div className={`p-3 rounded-lg ${color} bg-opacity-20 text-xl`}>
        <Icon className={`text-lg ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-lg font-semibold text-foreground">{value}</h3>
      </div>
    </div>
  )
}

export default function StatisticsPage() {
  const { data, isLoading, isError } = useProductSaleStats()
  const { data: orderStatsData } = useGetOrderStats()
  const orderStats = orderStatsData?.data || {}
  const {
    data: saleStatsData,
    isLoading: isSalesLoading,
    isError: isSalesError,
  } = useGetSalesStats()

  const loading = isLoading || isSalesLoading
  const error = isError || isSalesError

  if (error) {
    return (
      <div className="text-center text-red-500">
        Failed to load product or sale statistics
      </div>
    )
  }

  const { total = {}, byCategory = [] } = data?.data || {}
  const salestats = saleStatsData?.data || {}

  return (
    <DashboardLayout>
      <div className="p-2 space-y-10">
        {/* Product Stats */}
        <div>
          <h2 className="text-xl font-bold text-muted-foreground mb-4">
            Product Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading ? (
              [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
            ) : (
              <>
                <StatCard
                  icon={FaBoxOpen}
                  title="Total Products"
                  value={total.totalProducts}
                  color="bg-blue-500"
                />
                <StatCard
                  icon={FaCheckCircle}
                  title="Active Products"
                  value={total.totalActive}
                  color="bg-green-500"
                />
                <StatCard
                  icon={FaTimesCircle}
                  title="Inactive Products"
                  value={total.totalInactive}
                  color="bg-red-500"
                />
                <StatCard
                  icon={FaStar}
                  title="Avg Rating"
                  value={
                    typeof total.avgRating === 'number'
                      ? total.avgRating.toFixed(1)
                      : '0.0'
                  }
                  color="bg-yellow-500"
                />
              </>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-muted-foreground mb-4">
            Order Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <StatCard
              icon={FaTruck}
              title="Total Orders"
              value={orderStats.totalOrders}
              color="bg-blue-600"
            />
            <StatCard
              icon={FaMoneyBillWave}
              title="Total Revenue"
              value={`$${orderStats.totalRevenue?.toFixed(2)}`}
              color="bg-green-600"
            />
          </div>

          <div className="bg-card p-4 rounded-xl shadow-sm border">
            <h3 className="text-md font-semibold text-foreground mb-3">
              Order Status Breakdown
            </h3>
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="p-3">Status</th>
                  <th className="p-3">Count</th>
                  <th className="p-3">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {orderStats.statusBreakdown?.map((stat, i) => (
                  <tr
                    key={i}
                    className={`${
                      i % 2 === 0 ? 'bg-muted/40' : 'bg-muted/30'
                    } border-t`}
                  >
                    <td className="p-3">{stat.status}</td>
                    <td className="p-3">{stat.count}</td>
                    <td className="p-3">${stat.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sale Stats */}
        <div>
          <h2 className="text-xl font-bold text-muted-foreground mb-4">
            Sales Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading ? (
              [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
            ) : (
              <>
                <StatCard
                  icon={FaTags}
                  title="Total Sales"
                  value={salestats.totalSales}
                  color="bg-indigo-500"
                />
                <StatCard
                  icon={FaCheckCircle}
                  title="Active Sales"
                  value={salestats.activeSales}
                  color="bg-emerald-500"
                />
                <StatCard
                  icon={FaBoxOpen}
                  title="Products on Sale"
                  value={salestats.totalProductsOnSale}
                  color="bg-pink-500"
                />
                <StatCard
                  icon={FaPercent}
                  title="Avg Discount (%)"
                  value={
                    typeof salestats.avgDiscount === 'number'
                      ? `${salestats.avgDiscount.toFixed(1)}%`
                      : '0.0%'
                  }
                  color="bg-orange-500"
                />
              </>
            )}
          </div>
        </div>

        {/* Table View */}
        {loading ? (
          <TableSkeleton />
        ) : (
          <div className="bg-card p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Products by Category
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
                    <th className="p-3">Total</th>
                    <th className="p-3">Active</th>
                    <th className="p-3">Inactive</th>
                    <th className="p-3 min-w-[90px]">Avg Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {byCategory.map((cat, i) => (
                    <tr
                      key={cat._id}
                      className={`${
                        i % 2 === 0 ? 'bg-muted/40' : 'bg-muted/30'
                      } border-t`}
                    >
                      <td className="p-3">{cat.count}</td>
                      <td className="p-3 text-green-600">{cat.activeCount}</td>
                      <td className="p-3 text-red-500">{cat.inactiveCount}</td>
                      <td className="p-3">
                        {typeof cat.avgRating === 'number'
                          ? cat.avgRating.toFixed(1)
                          : '0.0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
