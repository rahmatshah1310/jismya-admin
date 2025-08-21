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
} from 'lucide-react'
// import Image from 'next/image'
import Link from 'next/link'

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    changeType: 'positive',
    icon: DollarSign,
    description: 'From last month',
  },
  {
    title: 'Total Orders',
    value: '2,350',
    change: '+180.1%',
    changeType: 'positive',
    icon: ShoppingCart,
    description: 'From last month',
  },
  {
    title: 'Total Products',
    value: '12,234',
    change: '+19%',
    changeType: 'positive',
    icon: Package,
    description: 'From last month',
  },
  {
    title: 'Active Users',
    value: '573',
    change: '+201',
    changeType: 'positive',
    icon: Users,
    description: 'From last month',
  },
]

const recentOrders = [
  {
    id: '1',
    customer: 'John Doe',
    product: 'Premium Bra Set',
    amount: '$89.99',
    status: 'completed',
    date: '2024-01-15',
  },
  {
    id: '2',
    customer: 'Jane Smith',
    product: 'Lace Panties',
    amount: '$29.99',
    status: 'pending',
    date: '2024-01-14',
  },
  {
    id: '3',
    customer: 'Mike Johnson',
    product: 'Silk Robe',
    amount: '$149.99',
    status: 'processing',
    date: '2024-01-13',
  },
]

export default function DashboardPage() {
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
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      stat.changeType === 'positive' ? 'default' : 'destructive'
                    }
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest orders from your customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center space-x-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {order.customer}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.product}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          order.status === 'completed'
                            ? 'default'
                            : order.status === 'pending'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {order.status}
                      </Badge>
                      <span className="text-sm font-medium">
                        {order.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-4">
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
                  {/* <Image
                    width={10}
                    height={10}
                    className="h-8 w-8 text-muted-foreground"
                  /> */}
                  <span className="text-sm font-medium">Upload Banner</span>
                </Link>
                <Link
                  href="/users"
                  className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <Users className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">View Users</span>
                </Link>
                <Link
                  href="/sales"
                  className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <Activity className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">Sales Analytics</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
