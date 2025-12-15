"use client"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function PrintOrderPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: order } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        *
      ),
      profiles (
        full_name,
        phone
      )
    `,
    )
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (!order) {
    redirect("/account/orders")
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="border-2 border-gray-300 p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-gray-200">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Sunehriluxurystyle</h1>
              <p className="text-sm text-gray-600">Premium Women's Fashion</p>
              <p className="text-sm text-gray-600">Mumbai, Maharashtra, India</p>
              <p className="text-sm text-gray-600">Phone: +91-1234567890</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold mb-2">INVOICE</h2>
              <p className="text-sm">Order #: {order.order_number}</p>
              <p className="text-sm">Date: {new Date(order.created_at).toLocaleDateString()}</p>
              <p className="text-sm">Status: {order.status.toUpperCase()}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="mb-8 grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-2">Bill To:</h3>
              <p className="text-sm">{order.billing_address.fullName}</p>
              <p className="text-sm">{order.billing_address.address}</p>
              <p className="text-sm">
                {order.billing_address.city}, {order.billing_address.state}
              </p>
              <p className="text-sm">{order.billing_address.pincode}</p>
              <p className="text-sm">Phone: {order.billing_address.phone}</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Ship To:</h3>
              <p className="text-sm">{order.shipping_address.fullName}</p>
              <p className="text-sm">{order.shipping_address.address}</p>
              <p className="text-sm">
                {order.shipping_address.city}, {order.shipping_address.state}
              </p>
              <p className="text-sm">{order.shipping_address.pincode}</p>
              <p className="text-sm">Phone: {order.shipping_address.phone}</p>
            </div>
          </div>

          {/* Order Items */}
          <table className="w-full mb-8">
            <thead className="bg-gray-100 border-y-2 border-gray-300">
              <tr>
                <th className="text-left py-3 px-4">Item</th>
                <th className="text-center py-3 px-4">Size</th>
                <th className="text-center py-3 px-4">Color</th>
                <th className="text-center py-3 px-4">Qty</th>
                <th className="text-right py-3 px-4">Price</th>
                <th className="text-right py-3 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((item: any) => (
                <tr key={item.id} className="border-b">
                  <td className="py-3 px-4">{item.product_name}</td>
                  <td className="text-center py-3 px-4">{item.size}</td>
                  <td className="text-center py-3 px-4">{item.color}</td>
                  <td className="text-center py-3 px-4">{item.quantity}</td>
                  <td className="text-right py-3 px-4">₹{item.price.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">₹{(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>₹{(order.subtotal || order.total_amount).toLocaleString()}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between py-2 text-green-600">
                  <span>Discount:</span>
                  <span>-₹{order.discount_amount.toLocaleString()}</span>
                </div>
              )}
              {order.shipping_amount > 0 && (
                <div className="flex justify-between py-2">
                  <span>Shipping:</span>
                  <span>₹{order.shipping_amount.toLocaleString()}</span>
                </div>
              )}
              {order.tax_amount > 0 && (
                <div className="flex justify-between py-2">
                  <span>Tax (GST):</span>
                  <span>₹{order.tax_amount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t-2 border-gray-300 font-bold text-lg">
                <span>Total:</span>
                <span>₹{order.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-6 border-t-2 border-gray-200">
            <p className="text-sm text-gray-600">Thank you for shopping with Sunehriluxurystyle!</p>
            <p className="text-sm text-gray-600 mt-2">For any queries, contact us at support@sunehriluxurystyle.com</p>
          </div>
        </div>

        {/* Print Button */}
        <div className="mt-8 text-center print:hidden">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Print Invoice
          </button>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
