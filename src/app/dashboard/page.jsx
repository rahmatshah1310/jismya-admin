'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Activity,
  CreditCard,
  Image,
  Grid,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'
import { useProductSaleStats } from '../api/productApi'
import { useGetAllOrders, useGetOrderStats } from '../api/orderApi'
import { useGetSalesStats } from '../api/saleApi'
import RevenueChart from '@/components/RevenueChart'

export default function DashboardPage() {
  const { data: productData, isLoading: isProductsLoading } =
    useProductSaleStats()
  const { data: orderData, isLoading: isOrdersLoading } = useGetOrderStats()
  const { data: saleData, isLoading: isSalesLoading } = useGetSalesStats()

  const loading = isProductsLoading || isOrdersLoading || isSalesLoading
  const { data, isLoading } = useGetAllOrders({ page: 1, limit: 5 })
  // const recentOrders = data?.data?.orders || []

  // Extract totals
  const totalProducts = productData?.data?.total?.totalProducts || 0
  const totalOrders = orderData?.data?.totalOrders || 0
  const totalRevenue = orderData?.data?.totalRevenue || 0

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May']
  const revenue = [1200, 1500, 800, 1700, 2000]

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: 'From all orders',
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      description: 'All placed orders',
    },
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      description: 'All listed products',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your admin dashboard. Here's an overview of your
            business.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loading
            ? [...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse h-28" />
              ))
            : stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
          {/* <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest orders from your customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between space-x-4"
                    >
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          {order?.billingAddress?.name ||
                            order?.shippingAddress?.name ||
                            'Guest User'}
                        </p>

                        <div className="flex-1">
                          {order.items.map((item) => (
                            <div
                              key={item._id}
                              className="flex items-center gap-2"
                            >
                              <span>
                                {item.productId.productName} ({item.quantity})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-x-3 items-end gap-1">
                        <span className="text-sm font-medium">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                        <Badge
                          className={
                            order.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }
                        >
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card> */}
          <div className="col-span-4 bg-background border rounded">
            <RevenueChart months={months} revenue={revenue} />
          </div>

          <Card className="col-span-4 h-auto space-y-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/product"
                  className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <Package className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">Add Product</span>
                </Link>
                <Link
                  href="/banners"
                  className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <Image className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">Upload Banner</span>
                </Link>
                <Link
                  href="/orders"
                  className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">View Orders</span>
                </Link>
                <Link
                  href="/sales"
                  className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <Activity className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">Sales Analytics</span>
                </Link>
                <Link
                  href="/categories"
                  className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <Grid className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">View Categories</span>
                </Link>
                <Link
                  href="/statistics"
                  className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">View Orders</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
