import React from 'react'

const BillingAddress = ({ order }) => {
  return (
    <div>
      <div className="bg-background text-foreground p-6 rounded-lg border shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground">
              Name
            </label>
            <p className="text-foreground">{order.billingAddress.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Email
            </label>
            <p className="text-foreground">{order.billingAddress.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Phone
            </label>
            <p className="text-foreground">{order.billingAddress.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Country
            </label>
            <p className="text-foreground">{order.billingAddress.country}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              City
            </label>
            <p className="text-foreground">{order.billingAddress.city}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground">
              Complete Address
            </label>
            <p className="text-foreground">
              {order.billingAddress.completeAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingAddress
